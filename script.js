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

const responses = {
  "Je veux de l’eau": "💧 Voici de l’eau.",
  "Je veux manger": "🍎 D’accord, on va manger.",
  "Je veux mon jouet": "🧸 Voici ton jouet.",
  "Je veux regarder une vidéo": "🎮 D’accord, vidéo après les étoiles.",
  "Stop, je veux arrêter": "🛑 D’accord, on arrête.",
  "Je veux une pause": "😴 D’accord, pause."
};

function speak(message) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = "fr-FR";
  utterance.rate = 0.9;
  utterance.pitch = 1.1;

  window.speechSynthesis.speak(utterance);
}

function updateStars() {
  stars.forEach((star, index) => {
    star.textContent = index < tokenCount ? "⭐" : "⚪";

    if (index === tokenCount - 1) {
      star.classList.add("star-animate");
      setTimeout(() => {
        star.classList.remove("star-animate");
      }, 300);
    }
  });
}

function unlockReward() {
  rewardCard.classList.remove("locked");
  rewardCard.classList.add("unlocked");
  rewardTitle.textContent = "🎉 Bravo ! Récompense débloquée";
  rewardText.textContent = "Tu as gagné 3 étoiles grâce à tes communications.";
  speak("Bravo ! Récompense débloquée.");
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
    speak("Super !");
  }

  if (tokenCount >= maxTokens) {
    setTimeout(() => {
      unlockReward();
    }, 600);
  }
}

document.querySelectorAll(".symbol-card").forEach((button) => {
  button.addEventListener("click", () => {
    const message = button.dataset.message;
    const response = responses[message] || "D’accord.";

    speechText.textContent = message;
    rewardText.textContent = response;

    button.classList.add("pressed");

    speak(message);

    setTimeout(() => {
      speak(response);
      addToken();
    }, 900);

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
