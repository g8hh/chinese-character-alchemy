import array2D from "../../util/array2D.js";
export default class CollectionList {
    constructor(game, options) {
        this.game = game;
        this.collections = [];
        this.collectionListEl = options.collectionListEl;
        this.collectionDisplayEl = options.collectionDisplayEl;
        this.openedCollectionIdx = -1;
    }
    addCollection(collection) {
        const idx = this.collections.length;
        const collectionEl = document.createElement("div");
        collectionEl.classList.add("collection-list__item");
        collectionEl.innerText = collection.name;
        collectionEl.addEventListener("click", () => {
            this.openCollection(idx);
        });
        this.collectionListEl.appendChild(collectionEl);
        const nameEl = document.createElement("div");
        nameEl.classList.add("collection-list__item__name");
        collectionEl.appendChild(nameEl);
        const progressEl = document.createElement("div");
        progressEl.classList.add("collection-list__item__progress");
        nameEl.appendChild(progressEl);
        this.collections.push([
            collection,
            {
                wrapper: collectionEl,
                name: nameEl,
                progress: progressEl
            }
        ]);
        this.updateCollectionList();
    }
    openCollection(idx) {
        if (typeof idx === "undefined")
            idx = this.openedCollectionIdx;
        const collection = this.collections[idx]?.[0];
        if (typeof collection === "undefined")
            return;
        const unlocked = collection.getUnlocked(this.game.list);
        const [width, height] = array2D.measure(collection.items);
        let hintLeft = true;
        this.collectionDisplayEl.innerHTML = "";
        this.collectionDisplayEl.style.setProperty("--rows", width.toString());
        this.collectionDisplayEl.style.setProperty("--cols", height.toString());
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const isUnlocked = unlocked[y][x];
                const chineseCharacter = collection.items[y][x];
                if (isUnlocked === null ||
                    chineseCharacter === null)
                    continue;
                const itemEl = document.createElement("span");
                itemEl.classList.add("collection-display__item");
                itemEl.setAttribute("inner-info", "#" + (chineseCharacter.index + 1));
                itemEl.style.gridColumn = (x + 1).toString() + " / " + (x + 1).toString();
                itemEl.style.gridRow = (y + 1).toString() + " / " + (y + 1).toString();
                this.collectionDisplayEl.appendChild(itemEl);
                if (isUnlocked) {
                    itemEl.innerText = chineseCharacter.glyph;
                    itemEl.classList.add("unlocked");
                }
                else {
                    if (hintLeft) {
                        itemEl.innerText = chineseCharacter.glyph;
                        itemEl.classList.add("hint");
                        hintLeft = false;
                    }
                    else {
                        itemEl.innerText = "？";
                        itemEl.classList.add("locked");
                    }
                }
            }
        }
        this.openedCollectionIdx = idx;
    }
    updateCollectionList() {
        const list = this.game.list;
        for (const [collection, els] of this.collections) {
            const [cur, goal] = collection.getProgress(list);
            els.progress.innerText = `${cur}/${goal} (${(cur / goal * 100).toFixed(2).padStart(6, "0")}%)`;
            if (cur >= goal) {
                els.wrapper.classList.add("completed");
            }
        }
    }
}
