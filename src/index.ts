import Game from "./class/game/Game.js";
import chineseCharacters from "./data/chineseCharacters.js";

const saveKey = "hanja_game";
const savedata = localStorage.getItem(saveKey);

const game = new Game({
  chineseCharacterList: {
    chineseCharacters,
    listWrapperEl: document.getElementById("list-wrapper") as HTMLDivElement,
    listTitleEl: document.getElementById("list-title") as HTMLDivElement,
    unlocked: savedata !== null ? JSON.parse(savedata) : []
  },
  gameField: {
    canvas: document.getElementById("game-canvas") as HTMLCanvasElement,
    canvasWrapper: document.getElementById("game-canvas-wrapper") as HTMLDivElement,
  }
});
console.log(game);

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
