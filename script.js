let tokenCount = 0;
const maxTokens = 3;

const speechText = document.getElementById("speechText");
const speakButton = document.getElementById("speakButton");
const resetButton = document.getElementById("resetButton");
const rewardCard = document.getElementById("rewardCard");
const rewardTitle = document.getElementById("rewardTitle");
const rewardText = document.getElementById("rewardText");
const stars = [
  document.getElementById("star1"),
  document.getElementById("star2"),
  document.getElementById("star3")
];

function speak(message) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = "fr-FR";
  utterance.rate = 0.92;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function updateStars() {
  stars.forEach((star, index) => {
    star.textContent = index < tokenCount ? "⭐" : "⚪";
  });
}

function unlockReward() {
  rewardCard.classList.remove("locked");
  rewardCard.classList.add("unlocked");
  rewardTitle.textContent = "🎉 Bravo ! Récompense débloquée";
  rewardText.textContent = "L’enfant a gagné 3 étoiles grâce à ses communications.";
}

function lockReward() {
  rewardCard.classList.add("locked");
  rewardCard.classList.remove("unlocked");
  rewardTitle.textContent = "🎁 Récompense verrouillée";
  rewardText.textContent = "Gagne 3 étoiles pour débloquer la récompense.";
}

function addToken() {
  if (tokenCount < maxTokens) {
    tokenCount += 1;
    updateStars();
  }

  if (tokenCount >= maxTokens) {
    unlockReward();
    speak("Bravo ! Récompense débloquée.");
  }
}

document.querySelectorAll(".symbol-card").forEach((button) => {
  button.addEventListener("click", () => {
    const message = button.dataset.message;
    speechText.textContent = message;
    button.classList.add("pressed");

    speak(message);
    addToken();

    setTimeout(() => {
      button.classList.remove("pressed");
    }, 180);
  });
});

speakButton.addEventListener("click", () => {
  const message = speechText.textContent;
  if (message && message !== "Choisis une image") {
    speak(message);
  }
});

resetButton.addEventListener("click", () => {
  tokenCount = 0;
  updateStars();
  lockReward();
  speechText.textContent = "Choisis une image";
});

const copyFeedbackButton = document.getElementById("copyFeedback");
const copyStatus = document.getElementById("copyStatus");

copyFeedbackButton.addEventListener("click", async () => {
  const useful = document.getElementById("useful").value;
  const comment = document.getElementById("comment").value.trim();

  const feedback = `Feedback démo CAA\nUtilité: ${useful}\nAmélioration: ${comment || "(aucune remarque)"}`;

  try {
    await navigator.clipboard.writeText(feedback);
    copyStatus.textContent = "Feedback copié. Vous pouvez le coller dans un message.";
  } catch (error) {
    copyStatus.textContent = "Copie impossible automatiquement. Sélectionnez le texte manuellement.";
  }
});
