import Game from "./class/game/Game.js";
import chineseCharacters from "./data/chineseCharacters.js";
import collections from "./data/collections.js";
const saveKey = "hanja_game";
const savedata = localStorage.getItem(saveKey);
const game = new Game({
    chineseCharacterList: {
        chineseCharacters,
        listWrapperEl: document.getElementById("list-wrapper"),
        listTitleEl: document.getElementById("list-title"),
        unlocked: savedata !== null ? JSON.parse(savedata) : []
    },
    gameField: {
        canvas: document.getElementById("game-canvas"),
        canvasWrapper: document.getElementById("game-canvas-wrapper"),
    },
    collectionList: {
        collectionListEl: document.getElementById("collection-list"),
        collectionDisplayEl: document.getElementById("collection-display")
    }
});
for (const collection of collections) {
    game.collectionList.addCollection(collection);
}
let lastSave = Date.now();
function tick() {
    const time = Date.now();
    if (time - lastSave > 5000) {
        localStorage.setItem(saveKey, JSON.stringify(game.getSavedata()));
    }
    game.render();
    requestAnimationFrame(tick);
}
tick();
