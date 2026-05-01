let tokenCount = 0;
let maxTokens = 3;
let calmMode = false;
let voiceEnabled = true;
let animationsEnabled = true;
let timerInterval = null;

const speechText = document.getElementById("speechText");
const speakButton = document.getElementById("speakButton");
const resetButton = document.getElementById("resetButton");
const resetButtonTop = document.getElementById("resetButtonTop");
const rewardCard = document.getElementById("rewardCard");
const rewardTitle = document.getElementById("rewardTitle");
const rewardText = document.getElementById("rewardText");
const confetti = document.getElementById("confetti");
const calmModeButton = document.getElementById("calmModeButton");
const maxTokensSelect = document.getElementById("maxTokensSelect");
const voiceToggle = document.getElementById("voiceToggle");
const animationToggle = document.getElementById("animationToggle");
const timerBox = document.getElementById("timerBox");
const timerProgress = document.getElementById("timerProgress");
const timerText = document.getElementById("timerText");

const responses = {
  "Je veux de l’eau": "💧 Voici de l’eau.",
  "Je veux manger": "🍎 D’accord, on va manger.",
  "Je veux mon jouet": "🧸 Voici ton jouet.",
  "Je veux regarder une vidéo": "🎮 D’accord, vidéo après les étoiles.",
  "Stop, je veux arrêter": "🛑 D’accord, on arrête.",
  "Je veux une pause": "😴 D’accord, on fait une pause.",
  "J’ai besoin d’aide": "🙋 D’accord, je vais t’aider."
};

const tokenValues = {
  "Je veux de l’eau": 1,
  "Je veux manger": 1,
  "Je veux mon jouet": 1,
  "Je veux regarder une vidéo": 1,
  "Stop, je veux arrêter": 2,
  "Je veux une pause": 2,
  "J’ai besoin d’aide": 2
};

function speak(message) {
  if (!voiceEnabled) return;
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = "fr-FR";
  utterance.rate = calmMode ? 0.82 : 0.9;
  utterance.pitch = calmMode ? 1 : 1.1;

  window.speechSynthesis.speak(utterance);
}

function renderStars() {
  const tokenRow = document.querySelector(".token-row");
  tokenRow.innerHTML = "";

  for (let i = 0; i < maxTokens; i += 1) {
    const star = document.createElement("span");
    star.id = `star${i + 1}`;
    star.textContent = i < tokenCount ? "⭐" : "⚪";
    tokenRow.appendChild(star);
  }
}

function updateStars(animatedIndex = null) {
  renderStars();

  if (animatedIndex !== null && animationsEnabled) {
    const star = document.getElementById(`star${animatedIndex + 1}`);
    if (star) {
      star.classList.add("star-animate");
      setTimeout(() => star.classList.remove("star-animate"), 350);
    }
  }
}

function unlockReward() {
  rewardCard.classList.remove("locked");
  rewardCard.classList.add("unlocked");
  rewardTitle.textContent = "🎉 Bravo ! Récompense débloquée";
  rewardText.textContent = "Tu as gagné les étoiles grâce à tes communications.";

  if (!calmMode && animationsEnabled) {
    confetti.classList.remove("hidden");
    confetti.classList.add("confetti-animate");
  }

  speak("Bravo ! Récompense débloquée.");
}

function lockReward() {
  rewardCard.classList.add("locked");
  rewardCard.classList.remove("unlocked");
  rewardTitle.textContent = "🎁 Récompense verrouillée";
  rewardText.textContent = `Gagne ${maxTokens} étoiles pour débloquer la récompense.`;
  confetti.classList.add("hidden");
  confetti.classList.remove("confetti-animate");
}

function addToken(value = 1) {
  if (tokenCount >= maxTokens) return;

  const previousCount = tokenCount;
  tokenCount = Math.min(tokenCount + value, maxTokens);
  updateStars(previousCount);

  if (!calmMode) {
    setTimeout(() => speak("Super !"), 300);
  }

  if (tokenCount >= maxTokens) {
    setTimeout(() => unlockReward(), 900);
  }
}

function stopVisualTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  timerBox.classList.add("hidden");
  timerProgress.style.width = "100%";
}

function startVisualTimer(seconds = 10) {
  stopVisualTimer();
  timerBox.classList.remove("hidden");
  timerProgress.style.width = "100%";

  let remaining = seconds;
  timerText.textContent = `${remaining} secondes`;

  timerInterval = setInterval(() => {
    remaining -= 1;
    timerText.textContent = `${remaining} secondes`;
    timerProgress.style.width = `${(remaining / seconds) * 100}%`;

    if (remaining <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerText.textContent = "Pause terminée";
      speak("Pause terminée.");
    }
  }, 1000);
}

function resetDemo() {
  tokenCount = 0;
  updateStars();
  lockReward();
  stopVisualTimer();
  speechText.textContent = "Choisis une image";
}

document.querySelectorAll(".symbol-card").forEach((button) => {
  button.addEventListener("click", () => {
    if (tokenCount >= maxTokens) return;

    const message = button.dataset.message;
    const response = responses[message] || "D’accord.";
    const tokenValue = tokenValues[message] || 1;

    speechText.textContent = message;
    rewardText.textContent = response;

    if (animationsEnabled) button.classList.add("pressed");

    speak(message);

    setTimeout(() => speak(response), 900);
    setTimeout(() => addToken(tokenValue), 1300);

    if (message === "Je veux une pause") {
      setTimeout(() => startVisualTimer(10), 900);
    }

    setTimeout(() => button.classList.remove("pressed"), 200);
  });
});

speakButton.addEventListener("click", () => {
  const message = speechText.textContent;
  if (message && message !== "Choisis une image") speak(message);
});

resetButton.addEventListener("click", resetDemo);
resetButtonTop.addEventListener("click", resetDemo);

calmModeButton.addEventListener("click", () => {
  calmMode = !calmMode;
  document.body.classList.toggle("calm-mode", calmMode);
  calmModeButton.textContent = calmMode ? "Mode normal" : "Mode calme";
});

maxTokensSelect.addEventListener("change", () => {
  maxTokens = Number(maxTokensSelect.value);
  resetDemo();
});

voiceToggle.addEventListener("change", () => {
  voiceEnabled = voiceToggle.checked;
});

animationToggle.addEventListener("change", () => {
  animationsEnabled = animationToggle.checked;
  document.body.classList.toggle("no-animations", !animationsEnabled);
});

const copyFeedbackButton = document.getElementById("copyFeedback");
const copyStatus = document.getElementById("copyStatus");

copyFeedbackButton.addEventListener("click", async () => {
  const useful = document.getElementById("useful").value;
  const comment = document.getElementById("comment").value.trim();

  const feedback = `Feedback démo Svox\nUtilité: ${useful}\nAmélioration: ${comment || "(aucune remarque)"}`;

  try {
    await navigator.clipboard.writeText(feedback);
    copyStatus.textContent = "Feedback copié. Vous pouvez le coller dans un message.";
  } catch (error) {
    copyStatus.textContent = "Copie impossible automatiquement.";
  }
});

renderStars();
lockReward();
