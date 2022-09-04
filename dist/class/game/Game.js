import ChineseCharacterList from "./ChineseCharacterList.js";
import GameField from "./GameField.js";
import CollectionList from "./CollectionList.js";
export default class Game {
    constructor(options) {
        this.list = new ChineseCharacterList(this, options.chineseCharacterList);
        this.field = new GameField(this, options.gameField);
        this.collectionList = new CollectionList(this, options.collectionList);
        this.unlockBases();
    }
    unlockBases() {
        const unlockedCount = this.list.unlocked.length;
        const chineseCharacters = this.list.chineseCharacters;
        const bases = chineseCharacters.filter(c => c.shapes.length === 0).sort((a, b) => b.parents.length - a.parents.length);
        const unlockCount = Math.ceil(Math.max(0, unlockedCount - 10) / 5) + 10;
        for (let i = 0; i < unlockCount; i++) {
            const toUnlock = bases[i];
            if (!toUnlock)
                continue;
            const idx = toUnlock.index;
            if (this.list.unlocked.includes(idx))
                continue;
            this.list.unlockItem(idx);
            const unlocked = this.list.chineseCharacters[idx];
            for (let i = 0; i < 5; i++) {
                this.field.addItem(unlocked);
            }
        }
    }
    toggleHideCompleted() {
        this.list.hideCompleted = !this.list.hideCompleted;
        this.list.update();
    }
    unlockItem(idx) {
        this.list.unlockItem(idx);
        this.unlockBases();
        this.collectionList.updateCollectionList();
        this.collectionList.openCollection();
    }
    getSavedata() {
        const list = this.list;
        return list.unlocked.map(idx => list.chineseCharacters[idx].glyph);
    }
    render() {
        this.field.render();
    }
}
