export default class ChineseCharacterList {
    constructor(game, options) {
        this.game = game;
        this.chineseCharacters = [...options.chineseCharacters];
        this.unlocked = options.unlocked
            .map(char => this.chineseCharacters.findIndex(c => c.glyph === char))
            .filter(idx => idx !== -1);
        this.listTitleEl = options.listTitleEl;
        this.listWrapperEl = options.listWrapperEl;
        this.listItemEls = [];
        this.init();
    }
    init() {
        for (let i = 0; i < this.chineseCharacters.length; i++) {
            const chineseCharacter = this.chineseCharacters[i];
            const progress = this.getProgress(i);
            const itemEl = document.createElement("div");
            itemEl.classList.add("list-item");
            if (!this.unlocked.includes(i))
                itemEl.classList.add("hidden");
            itemEl.classList.add("tier" + chineseCharacter.getTier());
            itemEl.addEventListener("click", () => {
                this.clickItem(i);
            });
            if (progress === 1)
                itemEl.classList.add("completed");
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
            itemEl.appendChild(progressEl);
            this.listItemEls.push({
                wrapper: itemEl,
                glyph: glyphEl,
                tier: tierEl,
                index: idxEl,
                progress: progressEl
            });
            this.updateEl(i);
        }
        this.updateTitle();
    }
    unlockItem(idx) {
        if (this.unlocked.includes(idx))
            return;
        this.unlocked.push(idx);
        const els = this.listItemEls[idx];
        els.wrapper.classList.remove("hidden");
        const chineseCharacter = this.chineseCharacters[idx];
        for (const shape of chineseCharacter.shapes) {
            this.updateEl(shape.index);
        }
        this.updateTitle();
    }
    updateTitle() {
        const titleEl = this.listTitleEl;
        const progress = this.unlocked.length / this.chineseCharacters.length;
        titleEl.innerText = `List (${this.unlocked.length}/${this.chineseCharacters.length})`;
        titleEl.style.setProperty("--progress", progress * 100 + "%");
    }
    updateEl(idx) {
        const els = this.listItemEls[idx];
        const progress = this.getProgress(idx);
        els.progress.style.setProperty("--progress", progress * 100 + "%");
        if (progress === 1)
            els.wrapper.classList.add("completed");
    }
    clickItem(idx) {
        if (!this.unlocked.includes(idx))
            return;
        this.game.field.addItem(this.chineseCharacters[idx]);
    }
    getProgress(idx) {
        const parents = this.chineseCharacters[idx].parents;
        if (parents.length === 0)
            return 1;
        const progress = parents.reduce((a, b) => a + (this.unlocked.includes(b.index) ? 1 : 0), 0) / parents.length;
        return progress;
    }
    scrollToItem(idx) {
        const itemEl = this.listItemEls[idx]?.wrapper;
        if (itemEl) {
            itemEl.scrollIntoView({
                behavior: "smooth"
            });
            window.scrollTo({
                top: 0
            });
        }
    }
}
