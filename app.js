const modes = {
  care: {
    label: "Care",
    tasks: [
      {
        phrase: "I want food",
        keys: ["want", "food", "eat"],
        picture: "🍎",
        hint: "Use a short request to help your buddy eat.",
        reward: "🍎",
        color: "#d9787b",
      },
      {
        phrase: "I want drink",
        keys: ["want", "drink", "water", "juice"],
        picture: "🥤",
        hint: "Ask for a drink in a clear voice.",
        reward: "🥤",
        color: "#86b8d8",
      },
      {
        phrase: "Help me",
        keys: ["help", "me"],
        picture: "🤝",
        hint: "Practice asking for help.",
        reward: "🤝",
        color: "#f6bf5d",
      },
      {
        phrase: "I need toilet",
        keys: ["need", "toilet", "bathroom"],
        picture: "🚽",
        hint: "Practice an important daily need.",
        reward: "⭐",
        color: "#7a9b76",
      },
    ],
  },
  dress: {
    label: "Dress",
    tasks: [
      {
        phrase: "Red dress",
        keys: ["red", "dress"],
        picture: "👗",
        hint: "Say the color and clothing.",
        reward: "❤️",
        color: "#d9787b",
      },
      {
        phrase: "Blue shoes",
        keys: ["blue", "shoes", "shoe"],
        picture: "👟",
        hint: "Ask for blue shoes.",
        reward: "💙",
        color: "#5d9dcc",
      },
      {
        phrase: "Hat please",
        keys: ["hat", "please"],
        picture: "👒",
        hint: "Use a polite request.",
        reward: "👒",
        color: "#f6bf5d",
        hat: true,
      },
      {
        phrase: "Green dress",
        keys: ["green", "dress"],
        picture: "🥬",
        hint: "Change your buddy's dress color.",
        reward: "💚",
        color: "#7a9b76",
      },
    ],
  },
  animals: {
    label: "Animals",
    tasks: [
      {
        phrase: "Hello dog",
        keys: ["hello", "dog"],
        picture: "🐶",
        hint: "Greet the animal friend.",
        reward: "🐶",
        color: "#a98fc4",
      },
      {
        phrase: "Cat says meow",
        keys: ["cat", "meow"],
        picture: "🐱",
        hint: "Try an animal sound.",
        reward: "🐱",
        color: "#f6bf5d",
      },
      {
        phrase: "Bird sing",
        keys: ["bird", "sing"],
        picture: "🐦",
        hint: "Ask the bird to sing.",
        reward: "🎵",
        color: "#86b8d8",
      },
    ],
  },
  story: {
    label: "Story",
    tasks: [
      {
        phrase: "Go park",
        keys: ["go", "park"],
        picture: "🌳",
        hint: "Choose the next story place.",
        reward: "🌳",
        color: "#7a9b76",
      },
      {
        phrase: "Eat apple",
        keys: ["eat", "apple"],
        picture: "🍏",
        hint: "Tell the story action.",
        reward: "🍏",
        color: "#8dbb58",
      },
      {
        phrase: "Help friend",
        keys: ["help", "friend"],
        picture: "🫶",
        hint: "Practice caring words.",
        reward: "🫶",
        color: "#d9787b",
      },
    ],
  },
  music: {
    label: "Music",
    tasks: [
      {
        phrase: "More music",
        keys: ["more", "music"],
        picture: "🎶",
        hint: "Ask for more music.",
        reward: "🎶",
        color: "#a98fc4",
      },
      {
        phrase: "Stop music",
        keys: ["stop", "music"],
        picture: "✋",
        hint: "Practice saying stop.",
        reward: "✋",
        color: "#86b8d8",
      },
      {
        phrase: "Sing again",
        keys: ["sing", "again"],
        picture: "🎤",
        hint: "Ask to repeat the song.",
        reward: "🎤",
        color: "#f6bf5d",
      },
    ],
  },
  color: {
    label: "Color",
    tasks: [
      {
        phrase: "Color red",
        keys: ["color", "red"],
        picture: "🖍️",
        hint: "Choose a color by speaking.",
        reward: "🔴",
        color: "#d9787b",
      },
      {
        phrase: "Color blue",
        keys: ["color", "blue"],
        picture: "🎨",
        hint: "Practice a color word.",
        reward: "🔵",
        color: "#5d9dcc",
      },
      {
        phrase: "Color yellow",
        keys: ["color", "yellow"],
        picture: "🟡",
        hint: "Paint with a bright color.",
        reward: "🟡",
        color: "#f6bf5d",
      },
    ],
  },
};

const state = {
  mode: "care",
  taskIndex: 0,
  stars: Number(localStorage.getItem("sethu-stars") || 0),
  streak: 0,
  strictness: localStorage.getItem("sethu-strictness") || "gentle",
  tapBackup: localStorage.getItem("sethu-tap-backup") !== "false",
  voiceRate: Number(localStorage.getItem("sethu-voice-rate") || 0.82),
  recognition: null,
  listening: false,
};

const els = {
  starCount: document.querySelector("#starCount"),
  streakCount: document.querySelector("#streakCount"),
  modeLabel: document.querySelector("#modeLabel"),
  buddyBubble: document.querySelector("#buddyBubble"),
  targetPhrase: document.querySelector("#targetPhrase"),
  promptHint: document.querySelector("#promptHint"),
  promptPicture: document.querySelector("#promptPicture"),
  heardLine: document.querySelector("#heardLine"),
  listenButton: document.querySelector("#listenButton"),
  tapHelpButton: document.querySelector("#tapHelpButton"),
  speakPromptButton: document.querySelector("#speakPromptButton"),
  settingsButton: document.querySelector("#settingsButton"),
  closeSettingsButton: document.querySelector("#closeSettingsButton"),
  settingsPanel: document.querySelector("#settingsPanel"),
  strictnessSelect: document.querySelector("#strictnessSelect"),
  tapBackupToggle: document.querySelector("#tapBackupToggle"),
  voiceRate: document.querySelector("#voiceRate"),
  buddy: document.querySelector(".buddy"),
  buddyDress: document.querySelector("#buddyDress"),
  buddyHat: document.querySelector("#buddyHat"),
  rewardShelf: document.querySelector("#rewardShelf"),
  modeTabs: document.querySelectorAll(".mode-tab"),
};

function currentTask() {
  return modes[state.mode].tasks[state.taskIndex];
}

function normalizeSpeech(text) {
  return text.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

function speaksText(text, extra = {}) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = extra.rate || state.voiceRate;
  utterance.pitch = extra.pitch || 1.08;
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find((voice) => /female|zira|samantha|google uk english female/i.test(voice.name));
  if (preferredVoice) utterance.voice = preferredVoice;
  window.speechSynthesis.speak(utterance);
}

function updateUi() {
  const task = currentTask();
  els.starCount.textContent = state.stars;
  els.streakCount.textContent = state.streak;
  els.modeLabel.textContent = modes[state.mode].label;
  els.targetPhrase.textContent = task.phrase;
  els.promptHint.textContent = task.hint;
  els.promptPicture.textContent = task.picture;
  els.buddyBubble.textContent = `Can you say: ${task.phrase}?`;
  els.buddyDress.style.background = task.color;
  els.buddyHat.classList.toggle("unlocked", Boolean(task.hat || state.stars >= 8));
  els.tapHelpButton.disabled = !state.tapBackup;
  els.tapHelpButton.style.opacity = state.tapBackup ? "1" : "0.45";
  els.strictnessSelect.value = state.strictness;
  els.tapBackupToggle.checked = state.tapBackup;
  els.voiceRate.value = state.voiceRate;
  els.modeTabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.mode === state.mode));
}

function setHeard(text, type = "") {
  els.heardLine.className = `heard-line ${type}`.trim();
  els.heardLine.textContent = text;
}

function isMatch(transcript, task) {
  const heard = normalizeSpeech(transcript);
  if (!heard) return false;
  const phraseWords = normalizeSpeech(task.phrase).split(" ");
  const keyHits = task.keys.filter((key) => heard.includes(key)).length;
  if (state.strictness === "phrase") {
    const phraseHits = phraseWords.filter((word) => heard.includes(word)).length;
    return phraseHits >= Math.max(1, phraseWords.length - 1);
  }
  return keyHits >= Math.min(2, task.keys.length);
}

function addSticker(reward) {
  const sticker = document.createElement("span");
  sticker.className = "sticker";
  sticker.textContent = reward;
  els.rewardShelf.append(sticker);
  while (els.rewardShelf.children.length > 8) {
    els.rewardShelf.firstElementChild.remove();
  }
}

function celebrate(task, heardText) {
  state.stars += 1;
  state.streak += 1;
  localStorage.setItem("sethu-stars", String(state.stars));
  addSticker(task.reward);
  els.buddy.classList.remove("celebrate");
  void els.buddy.offsetWidth;
  els.buddy.classList.add("celebrate");
  setHeard(heardText ? `I heard: "${heardText}"` : "Helpful tap used. Nice practice.", "good");
  els.buddyBubble.textContent = "Thank you! You helped me.";
  speaksText("Thank you. You helped me.", { pitch: 1.12 });
  window.setTimeout(nextTask, 1300);
}

function nextTask() {
  const tasks = modes[state.mode].tasks;
  state.taskIndex = (state.taskIndex + 1) % tasks.length;
  setHeard("Tap the microphone when Sethu is ready.");
  updateUi();
  speaksText(`Say ${currentTask().phrase}`);
}

function tryAgain(transcript) {
  state.streak = 0;
  setHeard(transcript ? `I heard: "${transcript}". Try once more.` : "I did not hear that. Try once more.", "try");
  els.buddyBubble.textContent = "Try with me. You can go slowly.";
  speaksText(`Try with me. ${currentTask().phrase}`, { rate: Math.max(0.65, state.voiceRate - 0.08) });
  updateUi();
}

function setupRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    setHeard("This browser needs Android Chrome for speech listening.", "try");
    els.listenButton.disabled = true;
    return;
  }

  state.recognition = new SpeechRecognition();
  state.recognition.lang = "en-US";
  state.recognition.interimResults = false;
  state.recognition.continuous = false;

  state.recognition.addEventListener("start", () => {
    state.listening = true;
    els.listenButton.classList.add("listening");
    els.listenButton.lastChild.textContent = " Listening";
    setHeard("Listening...");
  });

  state.recognition.addEventListener("end", () => {
    state.listening = false;
    els.listenButton.classList.remove("listening");
    els.listenButton.lastChild.textContent = " Listen";
  });

  state.recognition.addEventListener("result", (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join(" ");
    const task = currentTask();
    if (isMatch(transcript, task)) {
      celebrate(task, transcript);
    } else {
      tryAgain(transcript);
    }
  });

  state.recognition.addEventListener("error", () => {
    tryAgain("");
  });
}

function startListening() {
  if (!state.recognition || state.listening) return;
  try {
    window.speechSynthesis?.cancel();
    state.recognition.start();
  } catch {
    setHeard("The microphone is warming up. Try again.", "try");
  }
}

function switchMode(mode) {
  state.mode = mode;
  state.taskIndex = 0;
  setHeard("Tap the microphone when Sethu is ready.");
  updateUi();
  speaksText(`${modes[mode].label} mode. Say ${currentTask().phrase}`);
}

els.listenButton.addEventListener("click", startListening);
els.tapHelpButton.addEventListener("click", () => {
  if (state.tapBackup) celebrate(currentTask(), "");
});
els.speakPromptButton.addEventListener("click", () => {
  speaksText(`Say ${currentTask().phrase}`);
});
els.modeTabs.forEach((tab) => {
  tab.addEventListener("click", () => switchMode(tab.dataset.mode));
});
els.settingsButton.addEventListener("click", () => {
  els.settingsPanel.classList.add("open");
  els.settingsPanel.setAttribute("aria-hidden", "false");
});
els.closeSettingsButton.addEventListener("click", () => {
  els.settingsPanel.classList.remove("open");
  els.settingsPanel.setAttribute("aria-hidden", "true");
});
els.settingsPanel.addEventListener("click", (event) => {
  if (event.target === els.settingsPanel) els.closeSettingsButton.click();
});
els.strictnessSelect.addEventListener("change", (event) => {
  state.strictness = event.target.value;
  localStorage.setItem("sethu-strictness", state.strictness);
});
els.tapBackupToggle.addEventListener("change", (event) => {
  state.tapBackup = event.target.checked;
  localStorage.setItem("sethu-tap-backup", String(state.tapBackup));
  updateUi();
});
els.voiceRate.addEventListener("input", (event) => {
  state.voiceRate = Number(event.target.value);
  localStorage.setItem("sethu-voice-rate", String(state.voiceRate));
});

window.speechSynthesis?.addEventListener?.("voiceschanged", () => {});
setupRecognition();
updateUi();
window.setTimeout(() => speaksText(`Hello Sethu. Say ${currentTask().phrase}`), 500);
