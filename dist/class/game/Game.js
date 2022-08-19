import ChineseCharacterList from "./ChineseCharacterList.js";
import GameField from "./GameField.js";
export default class Game {
    constructor(options) {
        this.list = new ChineseCharacterList(this, options.chineseCharacterList);
        this.field = new GameField(this, options.gameField);
        this.unlockBases();
    }
    unlockBases() {
        const unlockedCount = this.list.unlocked.length;
        const chineseCharacters = this.list.chineseCharacters;
        const bases = chineseCharacters.filter(c => c.shapes.length === 0).sort((a, b) => b.parents.length - a.parents.length);
        const unlockCount = Math.ceil(Math.max(0, unlockedCount - 10) / 5) + 10;
        for (let i = 0; i < unlockCount; i++) {
            const toUnlock = bases[i];
            const idx = toUnlock.index;
            if (this.list.unlocked.includes(idx))
                continue;
            this.list.unlockItem(idx);
        }
    }
    unlockItem(idx) {
        this.list.unlockItem(idx);
        this.unlockBases();
    }
    getSavedata() {
        const list = this.list;
        return list.unlocked.map(idx => list.chineseCharacters[idx].glyph);
    }
    render() {
        this.field.render();
    }
}
