import type Game from "./Game.js";
import type ChineseCharacter from "./ChineseCharacter.js";

export interface ChineseCharacterListOptions {
  chineseCharacters: ChineseCharacter[];
  unlocked: string[];
  listWrapperEl: HTMLElement;
}
interface ListItemEl {
  wrapper: HTMLDivElement;
  glyph: HTMLDivElement;
  index: HTMLDivElement;
  tier: HTMLDivElement;
  progress: HTMLDivElement;
}

export default class ChineseCharacterList {
  private readonly game: Game;
  readonly chineseCharacters: ChineseCharacter[];
  readonly unlocked: number[];
  readonly listWrapperEl: HTMLElement;
  private readonly listItemEls: ListItemEl[];

  constructor(game: Game, options: ChineseCharacterListOptions) {
    this.game = game;
    this.chineseCharacters = [...options.chineseCharacters];
    this.unlocked = options.unlocked
      .map(char => this.chineseCharacters.findIndex(c => c.glyph === char))
      .filter(idx => idx !== -1);
    this.listWrapperEl = options.listWrapperEl;
    this.listItemEls = [];

    this.init();
  }

  private init() {
    for (let i = 0; i < this.chineseCharacters.length; i++) {
      const chineseCharacter = this.chineseCharacters[i];
      const progress = this.getProgress(i);

      const itemEl = document.createElement("div");
      itemEl.classList.add("list-item");
      if (!this.unlocked.includes(i)) itemEl.classList.add("hidden");
      itemEl.classList.add("tier" + chineseCharacter.getTier());
      itemEl.addEventListener("click", () => {
        this.clickItem(i);
      });
      if (progress === 1) itemEl.classList.add("completed");
      this.listWrapperEl.appendChild(itemEl);
      
      const glyphEl = document.createElement("div");
      glyphEl.classList.add("list-item__glyph");
      glyphEl.innerText = chineseCharacter.glyph;
      itemEl.appendChild(glyphEl);
      
      const tierEl = document.createElement("div");
      tierEl.classList.add("list-item__tier");
      tierEl.innerText = "★".repeat(chineseCharacter.getTier());
      itemEl.appendChild(tierEl);
      
      const idxEl = document.createElement("div");
      idxEl.classList.add("list-item__idx");
      idxEl.innerText = (i + 1).toString();
      itemEl.appendChild(idxEl);

      const progressEl = document.createElement("div");
      progressEl.classList.add("list-item__progress");
      progressEl.style.setProperty("--progress", progress*100 + "%");
      itemEl.appendChild(progressEl);

      this.listItemEls.push({
        wrapper: itemEl,
        glyph: glyphEl,
        tier: tierEl,
        index: idxEl,
        progress: progressEl
      });
    }
  }

  unlockItem(idx: number) {
    if (this.unlocked.includes(idx)) return;
    this.unlocked.push(idx);

    const els = this.listItemEls[idx];
    els.wrapper.classList.remove("hidden");

    const chineseCharacter = this.chineseCharacters[idx];
    for (const shape of chineseCharacter.shapes) {
      this.updateEl(shape.index);
    }
  }

  updateEl(idx: number) {
    const els = this.listItemEls[idx];
    const progress = this.getProgress(idx);

    els.progress.style.setProperty("--progress", progress*100 + "%");
    if (progress === 1) els.wrapper.classList.add("completed");
  }

  clickItem(idx: number) {
    if (!this.unlocked.includes(idx)) return;
    this.game.field.addItem(this.chineseCharacters[idx]);
  }

  getProgress(idx: number) {
    const parents = this.chineseCharacters[idx].parents;
    if (parents.length === 0) return 1;

    const progress = parents.reduce((a, b) => a + (this.unlocked.includes(b.index) ? 1 : 0), 0) / parents.length;
    return progress;
  }
}
