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
  completed: false,
  quiet: localStorage.getItem("sethu-quiet") === "true",
  dressColor: "red",
  blueShoes: false,
  hat: false,
  musicTimer: null,
  todayCount: Number(localStorage.getItem("sethu-today-count") || 0),
};

// Reset streak if more than one calendar day has passed
(function checkStreakOnLoad() {
  if (!state.lastPracticeDate) return;
  const today = todayKey();
  if (state.lastPracticeDate !== today) state.todayCount = 0;
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
  buddyDress: document.querySelector("#buddyDress"),
  buddyHat: document.querySelector("#buddyHat"),
  buddyShoes: document.querySelector("#buddyShoes"),
  listenLabel: document.querySelector("#listenLabel"),
  nextButton: document.querySelector("#nextButton"),
  quietToggle: document.querySelector("#quietToggle"),
  sceneResponse: document.querySelector("#sceneResponse"),
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
    if (state.quiet) return;
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
    melody() {
      const c = getCtx();
      if (!c || state.quiet) return;
      [261.63, 329.63, 392, 329.63].forEach((freq, i) =>
        playTone(freq, 0.3, "sine", 0.06, c.currentTime + i * 0.4)
      );
    },
    hush() { if (ctx) ctx.suspend(); },
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
  els.buddy.classList.add("speaking");
  utterance.onend = () => {
    state.speaking = false;
    els.buddy.classList.remove("speaking");
  };
  utterance.onerror = utterance.onend;

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
function updateUi(preserveBubble = false) {
  const task = currentTask();
  els.starCount.textContent = state.stars;
  els.streakCount.textContent = state.todayCount;
  els.modeLabel.textContent = modes[state.mode].label;
  els.targetPhrase.textContent = task.phrase;
  els.promptHint.textContent = task.hint;
  els.promptPicture.textContent = task.picture;
  if (task.phrase.endsWith("dress")) {
    const clothing = document.createElement("i");
    clothing.setAttribute("data-lucide", "shirt");
    clothing.style.fill = task.color;
    clothing.style.color = "#344d50";
    els.promptPicture.replaceChildren(clothing);
    window.lucide?.createIcons();
  }
  if (!preserveBubble) els.buddyBubble.textContent = `Can you say: ${task.phrase}?`;
  els.buddyDress.style.setProperty("--dress-filter", state.dressColor === "green" ? "hue-rotate(115deg)" : "none");
  els.buddyShoes.style.setProperty("--shoe-filter", state.blueShoes ? "hue-rotate(45deg)" : "none");
  els.buddyHat.classList.toggle("unlocked", state.hat);
  els.listenButton.hidden = state.completed;
  els.tapHelpButton.hidden = state.completed;
  els.nextButton.hidden = !state.completed;
  els.tapHelpButton.disabled = !state.tapBackup;
  els.tapHelpButton.style.opacity = state.tapBackup ? "1" : "0.45";
  els.strictnessSelect.value = state.strictness;
  els.tapBackupToggle.checked = state.tapBackup;
  els.voiceRate.value = state.voiceRate;
  els.quietToggle.checked = state.quiet;
  document.body.classList.toggle("quiet", state.quiet);
  els.modeTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.mode === state.mode);
    tab.setAttribute("aria-pressed", String(tab.dataset.mode === state.mode));
  });

  // Progress bar (10 stars per cycle)
  const progress = state.completed && state.stars % 10 === 0 ? 10 : state.stars % 10;
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
  const heardWords = new Set(heard.split(" "));
  const genericWords = new Set(["want", "need", "please", "color", "me", "go"]);
  const keyHits = task.keys.filter((key) => !genericWords.has(key) && heardWords.has(key)).length;
  if (state.strictness === "phrase") {
    const phraseHits = phraseWords.filter((word) => heardWords.has(word)).length;
    return phraseHits >= Math.max(1, phraseWords.length - 1);
  }
  return keyHits >= 1;
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
  if (state.completed) return;
  state.completed = true;
  state.todayCount = state.lastPracticeDate === todayKey() ? state.todayCount + 1 : 1;
  state.lastPracticeDate = todayKey();
  save("sethu-today-count", state.todayCount);
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
  const response = performTask(task);
  els.buddyBubble.textContent = response;
  speaksText(response, { pitch: 1.12 });
  updateUi(true);
}

function nextTask() {
  state.completed = false;
  els.sceneResponse.replaceChildren();
  els.sceneResponse.classList.remove("music-playing");
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
  setHeard(transcript ? `I heard: "${transcript}". Try once more.` : "Try once more.", "try");
  els.buddyBubble.textContent = "Try with me. You can go slowly.";
  speaksText(`Try with me. ${currentTask().phrase}`, {
    rate: Math.max(0.65, state.voiceRate - 0.08),
  });
  updateUi(true);
}

function noSpeechDetected() {
  // No penalty, no streak reset
  sound.boop();
  setHeard("I didn't hear you. Try again.", "try");
  els.buddyBubble.textContent = "Tap the mic and speak.";
  updateUi(true);
}

function micError() {
  // No penalty, no streak reset
  setHeard("The mic had trouble. Tap Help to continue.", "try");
  els.buddyBubble.textContent = "The mic isn't working. Tap Help.";
  updateUi(true);
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
    els.listenLabel.textContent = "Listening";
    setHeard("Listening...");
  });

  state.recognition.addEventListener("end", () => {
    state.listening = false;
    els.listenButton.classList.remove("listening");
    els.listenLabel.textContent = "Speak";
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
  if (!state.recognition || state.listening || state.completed) return;
  stopMusic();
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
  state.recognition?.abort();
  stopMusic();
  state.completed = false;
  els.sceneResponse.replaceChildren();
  els.sceneResponse.classList.remove("music-playing");
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

function stopMusic() {
  clearInterval(state.musicTimer);
  state.musicTimer = null;
  sound.hush();
  els.sceneResponse.classList.remove("music-playing");
}

function showResponse(picture, caption) {
  const object = document.createElement("span");
  object.className = "response-object";
  object.textContent = picture;
  object.setAttribute("aria-hidden", "true");
  const label = document.createElement("span");
  label.className = "response-caption";
  label.textContent = caption;
  els.sceneResponse.replaceChildren(object, label);
}

function performTask(task) {
  const responses = {
    "I want food": ["🍎", "Snack time!", "Thank you! Let's eat an apple."],
    "I want drink": ["🥤", "A cool drink", "Thank you! Here is my drink."],
    "Help me": ["🤝", "Together", "Yes! We can do it together."],
    "I need toilet": ["🚪", "Bathroom break", "Let's take a bathroom break."],
    "Red dress": ["❤️", "Red dress", "I love my red dress!"],
    "Green dress": ["💚", "Green dress", "Here is my green dress!"],
    "Blue shoes": ["👟", "Blue shoes", "My shoes are blue now!"],
    "Hat please": ["👒", "Hat on!", "Thank you! My hat is on."],
    "Hello dog": ["🐶", "Woof, woof!", "Hello, dog! Woof, woof!"],
    "Cat says meow": ["🐱", "Meow!", "Hello, cat! Meow!"],
    "Bird sing": ["🐦", "Tweet, tweet!", "The bird sings. Tweet, tweet!"],
    "Go park": ["🌳", "Off to the park", "Let's go to the park!"],
    "Eat apple": ["🍏", "Crunch!", "We eat an apple at the park. Crunch!"],
    "Help friend": ["🫶", "A helping hand", "Thank you for helping your friend!"],
    "More music": ["🎶", "Music is playing", "Let's hear some music."],
    "Stop music": ["✋", "Music stopped", "The music has stopped."],
    "Sing again": ["🎤", "One more song", "Let's play our song again."],
    "Color red": ["🔴", "Painted red", "You chose red!"],
    "Color blue": ["🔵", "Painted blue", "You chose blue!"],
    "Color yellow": ["🟡", "Painted yellow", "You chose yellow!"],
  };
  if (task.phrase === "Red dress") state.dressColor = "red";
  if (task.phrase === "Green dress") state.dressColor = "green";
  if (task.phrase === "Blue shoes") state.blueShoes = true;
  if (task.phrase === "Hat please") state.hat = true;
  if (state.mode === "color") els.sceneResponse.style.color = task.color;
  const [picture, caption, spoken] = responses[task.phrase];
  showResponse(picture, caption);
  if (state.mode === "music") {
    stopMusic();
    if (task.phrase !== "Stop music" && !state.quiet) {
      sound.melody();
      state.musicTimer = setInterval(() => sound.melody(), 1800);
      els.sceneResponse.classList.add("music-playing");
    } else if (task.phrase !== "Stop music") {
      showResponse("🎶", "Quiet music time");
      return "Your music is quiet.";
    }
  }
  return spoken;
}

// ------------------------------------------------------------
// EVENT LISTENERS
// ------------------------------------------------------------
els.listenButton.addEventListener("click", startListening);
els.nextButton.addEventListener("click", nextTask);
els.quietToggle.addEventListener("change", () => {
  state.quiet = els.quietToggle.checked;
  save("sethu-quiet", state.quiet);
  if (state.quiet) stopMusic();
  updateUi(true);
});

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
window.lucide?.createIcons();
document.addEventListener("visibilitychange", () => {
  if (document.hidden) { stopMusic(); state.recognition?.abort(); window.speechSynthesis?.cancel(); }
});

window.setTimeout(
  () => speaksText(`Hello Sethu. Say ${currentTask().phrase}`),
  500
);
