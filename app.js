// ============================================================
// SETHU'S BUDDY CARE
// ============================================================

// ------------------------------------------------------------
// MODES & TASKS
// Rule: every picture emoji is unique across the whole app.
// ------------------------------------------------------------

const modes = {
  care: {
    label: "Care",
    accent: "#d9787b",
    scene: {
      sky: "#c9e2ee",
      floor: "#98b878",
      extra: "care"
    },
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
    accent: "#86b8d8",
    scene: {
      sky: "#f8e0e3",
      floor: "#c0a0b8",
      extra: "dress"
    },
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
    accent: "#7a9b76",
    scene: {
      sky: "#c9e2ee",
      floor: "#8fc06f",
      extra: "animals"
    },
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
    accent: "#a98fc4",
    scene: {
      sky: "#c9b3e0",
      floor: "#8f7fae",
      extra: "story"
    },
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
        picture: "📖",
        hint: "Tell the story action.",
        reward: "📖",
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
    accent: "#f6bf5d",
    scene: {
      sky: "#3a3f5a",
      floor: "#2a2e44",
      extra: "music"
    },
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
    accent: "#e88fa4",
    scene: {
      sky: "#f5f0ff",
      floor: "#e8dfd0",
      extra: "color"
    },
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

// ------------------------------------------------------------
// PICTURE UNIQUENESS CHECK
// Fails loudly if any picture is used more than once.
// ------------------------------------------------------------
(function auditPictures() {
  const seen = {};
  Object.keys(modes).forEach((modeKey) => {
    modes[modeKey].tasks.forEach((task) => {
      if (seen[task.picture]) {
        console.error(
          `Picture lock violation: ${task.picture} used in both "${seen[task.picture]}" and "${task.phrase}"`
        );
      }
      seen[task.picture] = task.phrase;
    });
  });
})();

// ------------------------------------------------------------
// STATE
// ------------------------------------------------------------
const state = {
  mode: "care",
  taskIndex: 0,
  stars: Number(localStorage.getItem("sethu-stars") || 0),
  streak: Number(localStorage.getItem("sethu-streak") || 0),
  lastPracticeDate: localStorage.getItem("sethu-last-practice") || "",
  strictness: localStorage.getItem("sethu-strictness") || "gentle",
  tapBackup: localStorage.getItem("sethu-tap-backup") !== "false",
  voiceRate: Number(localStorage.getItem("sethu-voice-rate") || 0.82),
  recognition: null,
  listening: false,
  speaking: false,
};

// Reset streak if more than one calendar day has passed
(function checkStreakOnLoad() {
  if (!state.lastPracticeDate) return;
  const today = todayKey();
  const yesterday = yesterdayKey();
  if (state.lastPracticeDate !== today && state.lastPracticeDate !== yesterday) {
    state.streak = 0;
    localStorage.setItem("sethu-streak", "0");
  }
})();

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ------------------------------------------------------------
// DOM
// ------------------------------------------------------------
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
  buddyHead: document.querySelector(".head"),
  buddySmile: document.querySelector(".smile"),
  buddyDress: document.querySelector("#buddyDress"),
  buddyHat: document.querySelector("#buddyHat"),
  rewardShelf: document.querySelector("#rewardShelf"),
  modeTabs: document.querySelectorAll(".mode-tab"),
  room: document.querySelector("#room"),
  progressFill: document.querySelector("#progressFill"),
  progressCount: document.querySelector("#progressCount"),
  progressPanel: document.querySelector("#progressPanel"),
  sceneExtraCare: document.querySelector(".scene-extra-care"),
  sceneExtraDress: document.querySelector(".scene-extra-dress"),
  sceneExtraAnimals: document.querySelector(".scene-extra-animals"),
  sceneExtraStory: document.querySelector(".scene-extra-story"),
  sceneExtraMusic: document.querySelector(".scene-extra-music"),
  sceneExtraColor: document.querySelector(".scene-extra-color"),
};

// ------------------------------------------------------------
// SOUND ENGINE (Web Audio API, no external files)
// ------------------------------------------------------------
const sound = (() => {
  let ctx = null;

  function getCtx() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        return null;
      }
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  // Optional MP3 override slots — leave null to use generated tones
  const overrides = {
    ding: null,
    boop: null,
    click: null,
    chime: null,
  };

  function playTone(freq, duration, type, volume, startTime) {
    const c = getCtx();
    if (!c) return;
    const t0 = startTime || c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(volume, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  }

  function playOverride(name) {
    if (!overrides[name]) return false;
    try {
      const a = new Audio(overrides[name]);
      a.volume = 0.5;
      a.play();
      return true;
    } catch (e) {
      return false;
    }
  }

  return {
    ding() {
      if (playOverride("ding")) return;
      const c = getCtx();
      if (!c) return;
      const t = c.currentTime;
      playTone(659.25, 0.18, "sine", 0.15, t);
      playTone(987.77, 0.28, "sine", 0.12, t + 0.08);
    },
    boop() {
      if (playOverride("boop")) return;
      const c = getCtx();
      if (!c) return;
      playTone(220, 0.22, "sine", 0.12);
    },
    click() {
      if (playOverride("click")) return;
      const c = getCtx();
      if (!c) return;
      playTone(880, 0.05, "triangle", 0.06);
    },
    chime() {
      if (playOverride("chime")) return;
      const c = getCtx();
      if (!c) return;
      const t = c.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        playTone(f, 0.35, "sine", 0.1, t + i * 0.09);
      });
    },
    unlock() {
      // Called on the first user interaction to allow audio
      getCtx();
    },
  };
})();

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------
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
  const preferredVoice = voices.find((voice) =>
    /female|zira|samantha|google uk english female/i.test(voice.name)
  );
  if (preferredVoice) utterance.voice = preferredVoice;

  // Mouth animation while speaking
  state.speaking = true;
  els.buddySmile.classList.add("speaking");
  utterance.onend = () => {
    state.speaking = false;
    els.buddySmile.classList.remove("speaking");
  };

  window.speechSynthesis.speak(utterance);
}

function save(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch (e) {}
}

// ------------------------------------------------------------
// THEME / SCENE PER MODE
// ------------------------------------------------------------
function applyModeTheme() {
  const m = modes[state.mode];
  document.documentElement.style.setProperty("--accent", m.accent);
  document.documentElement.style.setProperty("--scene-sky", m.scene.sky);
  document.documentElement.style.setProperty("--scene-floor", m.scene.floor);

  // Show the matching scene extra
  const extras = {
    care: els.sceneExtraCare,
    dress: els.sceneExtraDress,
    animals: els.sceneExtraAnimals,
    story: els.sceneExtraStory,
    music: els.sceneExtraMusic,
    color: els.sceneExtraColor,
  };
  Object.keys(extras).forEach((key) => {
    const el = extras[key];
    if (!el) return;
    el.classList.toggle("visible", key === m.scene.extra);
  });
}

// ------------------------------------------------------------
// UI UPDATE
// ------------------------------------------------------------
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
  els.modeTabs.forEach((tab) =>
    tab.classList.toggle("active", tab.dataset.mode === state.mode)
  );

  // Progress bar (10 stars per cycle)
  const progress = state.stars % 10;
  els.progressFill.style.width = `${(progress / 10) * 100}%`;
  els.progressCount.textContent = `${progress} / 10`;

  applyModeTheme();
  pulseBubble();
  hopPicture();
}

function pulseBubble() {
  els.buddyBubble.classList.remove("pulse");
  void els.buddyBubble.offsetWidth;
  els.buddyBubble.classList.add("pulse");
}

function hopPicture() {
  els.promptPicture.style.animation = "none";
  void els.promptPicture.offsetWidth;
  els.promptPicture.style.animation = "";
}

function setHeard(text, type = "") {
  els.heardLine.className = `heard-line ${type}`.trim();
  els.heardLine.textContent = text;
}

// ------------------------------------------------------------
// MATCHING
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// STICKERS
// ------------------------------------------------------------
function addSticker(reward) {
  const sticker = document.createElement("span");
  sticker.className = "sticker";
  sticker.textContent = reward;
  els.rewardShelf.append(sticker);
  while (els.rewardShelf.children.length > 8) {
    els.rewardShelf.firstElementChild.remove();
  }
}

// ------------------------------------------------------------
// CELEBRATE
// ------------------------------------------------------------
function celebrate(task, heardText) {
  const prevStars = state.stars;
  state.stars += 1;
  state.streak += 1;
  save("sethu-stars", state.stars);
  save("sethu-streak", state.streak);
  save("sethu-last-practice", todayKey());

  // Ding sound
  sound.ding();

  // Milestone chime every 10 stars
  if (state.stars > 0 && state.stars % 10 === 0) {
    setTimeout(() => sound.chime(), 300);
    els.progressPanel.classList.add("celebrating");
    setTimeout(() => els.progressPanel.classList.remove("celebrating"), 1000);
  }

  addSticker(task.reward);

  // Body celebration
  els.buddy.classList.remove("celebrate");
  void els.buddy.offsetWidth;
  els.buddy.classList.add("celebrate");

  // Stickers dance in sequence
  els.rewardShelf.classList.add("dancing");
  setTimeout(() => els.rewardShelf.classList.remove("dancing"), 1000);

  setHeard(heardText ? `I heard: "${heardText}"` : "Helpful tap used. Nice practice.", "good");
  els.buddyBubble.textContent = "Thank you! You helped me.";
  speaksText("Thank you. You helped me.", { pitch: 1.12 });

  updateUi();
  window.setTimeout(nextTask, 1500);
}

function nextTask() {
  const tasks = modes[state.mode].tasks;
  state.taskIndex = (state.taskIndex + 1) % tasks.length;
  setHeard("Tap the microphone when Sethu is ready.");
  updateUi();
  speaksText(`Say ${currentTask().phrase}`);
}

// ------------------------------------------------------------
// RETRY / ERRORS
// ------------------------------------------------------------
function wrongAnswer(transcript) {
  state.streak = 0;
  save("sethu-streak", 0);
  sound.boop();
  els.buddyHead.classList.remove("tilt");
  void els.buddyHead.offsetWidth;
  els.buddyHead.classList.add("tilt");
  setHeard(transcript ? `I heard: "${transcript}". Try once more.` : "Try once more.", "try");
  els.buddyBubble.textContent = "Try with me. You can go slowly.";
  speaksText(`Try with me. ${currentTask().phrase}`, {
    rate: Math.max(0.65, state.voiceRate - 0.08),
  });
  updateUi();
}

function noSpeechDetected() {
  // No penalty, no streak reset
  sound.boop();
  setHeard("I didn't hear you. Try again.", "try");
  els.buddyBubble.textContent = "Tap the mic and speak.";
  updateUi();
}

function micError() {
  // No penalty, no streak reset
  setHeard("The mic had trouble. Tap Help to continue.", "try");
  els.buddyBubble.textContent = "The mic isn't working. Tap Help.";
  updateUi();
}

// ------------------------------------------------------------
// SPEECH RECOGNITION
// ------------------------------------------------------------
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
    els.listenButton.lastChild.textContent = "Listening";
    setHeard("Listening...");
    // Perk up head
    els.buddyHead.classList.remove("perk");
    void els.buddyHead.offsetWidth;
    els.buddyHead.classList.add("perk");
  });

  state.recognition.addEventListener("end", () => {
    state.listening = false;
    els.listenButton.classList.remove("listening");
    els.listenButton.lastChild.textContent = " Listen";
  });

  state.recognition.addEventListener("result", (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join(" ")
      .trim();
    const task = currentTask();
    if (!transcript) {
      noSpeechDetected();
      return;
    }
    if (isMatch(transcript, task)) {
      celebrate(task, transcript);
    } else {
      wrongAnswer(transcript);
    }
  });

  state.recognition.addEventListener("error", (event) => {
    if (event.error === "no-speech") {
      noSpeechDetected();
    } else if (event.error === "aborted") {
      // User aborted, ignore
    } else {
      micError();
    }
  });
}

function startListening() {
  sound.unlock();
  if (!state.recognition || state.listening) return;
  try {
    window.speechSynthesis?.cancel();
    state.recognition.start();
  } catch (e) {
    setHeard("The microphone is warming up. Try again.", "try");
  }
}

// ------------------------------------------------------------
// MODE SWITCH
// ------------------------------------------------------------
function switchMode(mode) {
  state.mode = mode;
  state.taskIndex = 0;
  setHeard("Tap the microphone when Sethu is ready.");
  updateUi();
  speaksText(`${modes[mode].label} mode. Say ${currentTask().phrase}`);
}

// ------------------------------------------------------------
// BLINK LOOP
// ------------------------------------------------------------
function scheduleBlink() {
  const delay = 3000 + Math.random() * 2000;
  setTimeout(() => {
    els.buddy.classList.add("blink");
    setTimeout(() => els.buddy.classList.remove("blink"), 140);
    scheduleBlink();
  }, delay);
}

// ------------------------------------------------------------
// EVENT LISTENERS
// ------------------------------------------------------------
els.listenButton.addEventListener("click", startListening);

els.tapHelpButton.addEventListener("click", () => {
  if (state.tapBackup) {
    sound.click();
    celebrate(currentTask(), "");
  }
});

els.speakPromptButton.addEventListener("click", () => {
  sound.click();
  speaksText(`Say ${currentTask().phrase}`);
});

els.modeTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    sound.click();
    switchMode(tab.dataset.mode);
  });
});

els.settingsButton.addEventListener("click", () => {
  sound.click();
  els.settingsPanel.classList.add("open");
  els.settingsPanel.setAttribute("aria-hidden", "false");
});

els.closeSettingsButton.addEventListener("click", () => {
  sound.click();
  els.settingsPanel.classList.remove("open");
  els.settingsPanel.setAttribute("aria-hidden", "true");
});

els.settingsPanel.addEventListener("click", (event) => {
  if (event.target === els.settingsPanel) els.closeSettingsButton.click();
});

els.strictnessSelect.addEventListener("change", (event) => {
  state.strictness = event.target.value;
  save("sethu-strictness", state.strictness);
});

els.tapBackupToggle.addEventListener("change", (event) => {
  state.tapBackup = event.target.checked;
  save("sethu-tap-backup", state.tapBackup);
  updateUi();
});

els.voiceRate.addEventListener("input", (event) => {
  state.voiceRate = Number(event.target.value);
  save("sethu-voice-rate", state.voiceRate);
});

// ------------------------------------------------------------
// INIT
// ------------------------------------------------------------
window.speechSynthesis?.addEventListener?.("voiceschanged", () => {});

setupRecognition();
updateUi();
scheduleBlink();

window.setTimeout(
  () => speaksText(`Hello Sethu. Say ${currentTask().phrase}`),
  500
);
