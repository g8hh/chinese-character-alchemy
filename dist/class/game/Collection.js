import array2D from "../../util/array2D.js";
export default class Collection {
    constructor(options) {
        this.name = options.name;
        this.items = options.items;
        this.hintCount = options.hintCount ?? 1;
    }
    getUnlocked(list) {
        const unlocked = list.unlocked;
        return array2D.replace(this.items, (c) => {
            return c !== null ? unlocked.includes(c.index) : c;
        });
    }
    getProgress(list) {
        const unlockedList = this.getUnlocked(list);
        const filtered = unlockedList.flat().filter(v => v !== null);
        return [filtered.reduce((a, b) => a + (b ? 1 : 0), 0), filtered.length];
    }
}
