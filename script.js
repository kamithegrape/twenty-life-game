let stats = {
  confidence: 0,
  love: 0,
  discipline: 0
};

let currentScene = "intro";

const scenes = {
  intro: {
    chapter: "Chapter 1 – The Beginning",
    text: "Ammi kehti hain ke meri paidaish ek thandi raat ko hui thi... Islamabad ki lights duur chamak rahi thi.",
    background: "https://images.unsplash.com/photo-1580651315530-69c8e0026377",
    choices: [
      { text: "Unki baat dhyan se suno", effect: { love: 1 }, next: "childhood" },
      { text: "Khamoshi se muskurao", effect: { confidence: 1 }, next: "childhood" }
    ]
  },

  childhood: {
    chapter: "Childhood",
    text: "Mera pehla khilona ek choti si plastic car thi. Mujhe lagta tha duniya meri hai.",
    background: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    choices: [
      { text: "Bahar khelo", effect: { confidence: 1 }, next: "school" },
      { text: "Andar baith kar draw karo", effect: { discipline: 1 }, next: "school" }
    ]
  },

  school: {
    chapter: "School Days",
    text: "School ka pehla din... haath kaanp rahe the. Dar bhi tha, excitement bhi.",
    background: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
    choices: [
      { text: "Naye dost banao", effect: { confidence: 2 }, next: "teenage" },
      { text: "Chup chap baitho", effect: { love: -1 }, next: "teenage" }
    ]
  },

  teenage: {
    chapter: "Teenage Years",
    text: "Yahi wo waqt tha jab mujhe laga ke main pyaar mein hoon.",
    background: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
    choices: [
      { text: "Apne jazbaat batao", effect: { love: 3 }, next: "present" },
      { text: "Dil mein chhupa lo", effect: { discipline: 1 }, next: "present" }
    ]
  },

  present: {
    chapter: "The Present – 20",
    text: function() {
      if (stats.discipline > stats.love) {
        return "Tumne ambition choose ki. Air Force ka khwab abhi zinda hai.";
      } else {
        return "Tumne dil ki suni. Mohabbat ne tumhe shape kiya.";
      }
    },
    background: "https://images.unsplash.com/photo-1508098682722-e99c643e7fbe",
    choices: [
      { text: "Restart Life", next: "intro" }
    ]
  }
};

function typeWriter(text, element, speed = 30) {
  element.innerHTML = "";
  let i = 0;
  function typing() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  }
  typing();
}

function saveGame() {
  localStorage.setItem("lifeGameSave", JSON.stringify({
    stats,
    currentScene
  }));
}

function loadGame() {
  const saved = localStorage.getItem("lifeGameSave");
  if (saved) {
    const data = JSON.parse(saved);
    stats = data.stats;
    currentScene = data.currentScene;
  }
}

function updateStats() {
  document.getElementById("conf").innerText = stats.confidence;
  document.getElementById("love").innerText = stats.love;
  document.getElementById("disc").innerText = stats.discipline;
}

function showScene(sceneKey) {
  currentScene = sceneKey;
  const scene = scenes[sceneKey];

  document.getElementById("chapter-title").innerText = scene.chapter;
  document.getElementById("background").style.backgroundImage = `url(${scene.background})`;

  const storyText = document.getElementById("story-text");

  const textContent = typeof scene.text === "function"
    ? scene.text()
    : scene.text;

  typeWriter(textContent, storyText);

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  scene.choices.forEach(choice => {
    const button = document.createElement("button");
    button.innerText = choice.text;
    button.onclick = () => {
      if (choice.effect) {
        for (let key in choice.effect) {
          if (!stats[key]) stats[key] = 0;
          stats[key] += choice.effect[key];
        }
      }
      updateStats();
      saveGame();
      showScene(choice.next);
    };
    choicesDiv.appendChild(button);
  });
}

document.body.addEventListener("click", () => {
  document.getElementById("bg-music").play().catch(()=>{});
});

loadGame();
updateStats();
showScene(currentScene);
