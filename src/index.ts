import Game from "./class/game/Game.js";
import chineseCharacters from "./data/chineseCharacters.js";
import collections from "./data/collections.js";

const saveKey = "hanja_game";
const savedata = localStorage.getItem(saveKey);

const fieldSaveKey = "hanja_game_field";
const fieldSaveData = localStorage.getItem(fieldSaveKey);

const game = new Game({
  chineseCharacterList: {
    chineseCharacters,
    listWrapperEl: document.getElementById("list-wrapper") as HTMLDivElement,
    listTitleEl: document.getElementById("list-title") as HTMLDivElement,
    unlocked: savedata !== null ? JSON.parse(savedata) : [],
  },
  gameField: {
    canvas: document.getElementById("game-canvas") as HTMLCanvasElement,
    canvasWrapper: document.getElementById(
      "game-canvas-wrapper"
    ) as HTMLDivElement,
    fieldSaveData: fieldSaveData !== null ? JSON.parse(fieldSaveData) : [],
  },
  collectionList: {
    collectionListEl: document.getElementById(
      "collection-list"
    ) as HTMLDivElement,
    collectionDisplayEl: document.getElementById(
      "collection-display"
    ) as HTMLDivElement,
  },
});

for (const collection of collections) {
  game.collectionList.addCollection(collection);
}

(document.getElementById("gold-toggle") as HTMLDivElement).addEventListener(
  "click",
  () => {
    game.toggleHideCompleted();
  }
);
(document.getElementById("save-space") as HTMLDivElement).addEventListener(
  "click",
  () => {
    localStorage.setItem(fieldSaveKey, JSON.stringify(game.field.exportData()));
  }
);

const collectionsEl = document.getElementById("collections") as HTMLDivElement;
document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (!e.ctrlKey && key === "c") {
    collectionsEl.classList.toggle("hidden");
  }
});

let lastSave = Date.now();
function tick() {
  const time = Date.now();
  if (time - lastSave > 5000) {
    localStorage.setItem(saveKey, JSON.stringify(game.getSavedata()));
    lastSave = time;
  }

  game.render();
  requestAnimationFrame(tick);
}
tick();
