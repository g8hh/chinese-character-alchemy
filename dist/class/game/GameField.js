import Field from "../util/Field.js";
import GameFieldItem from "./GameFieldItem.js";
export default class GameField {
    constructor(game, options) {
        this.game = game;
        this.items = [];
        this.field = new Field({
            camera: {
                x: 0,
                y: -50,
                zoom: 1 / 100
            },
            size: options.canvasWrapper,
            canvasEl: options.canvas
        });
        this.canvasEl = options.canvas;
        this.isMouseDown = false;
        this.selectedItem = undefined;
        this.lastPosition = [0, 0];
        this.canvasEl.addEventListener("mousemove", (e) => {
            let curPosition = [e.offsetX, e.offsetY];
            if (this.isMouseDown &&
                this.selectedItem) {
                const { x: x1, y: y1 } = this.field.globalToLocalAttr({
                    x: this.lastPosition[0],
                    y: this.lastPosition[1]
                });
                const { x: x2, y: y2 } = this.field.globalToLocalAttr({
                    x: curPosition[0],
                    y: curPosition[1]
                });
                this.selectedItem.position[0] += x2 - x1;
                this.selectedItem.position[1] += y2 - y1;
            }
            this.lastPosition = curPosition;
        });
        document.addEventListener("mousedown", () => {
            this.isMouseDown = true;
            const { x, y } = this.field.globalToLocalAttr({
                x: this.lastPosition[0],
                y: this.lastPosition[1]
            });
            this.selectedItem = this.items.find(item => item.isPointInItem(x, y));
            if (this.selectedItem) {
                this.items = this.items.filter(item => item !== this.selectedItem);
                this.items.unshift(this.selectedItem);
            }
        });
        this.canvasEl.addEventListener("mouseout", () => {
            this.isMouseDown = false;
        });
        document.addEventListener("mouseup", () => {
            this.isMouseDown = false;
            if (this.selectedItem) {
                this.checkMerge(this.selectedItem);
            }
        });
        document.addEventListener("blur", () => {
            this.isMouseDown = false;
        });
    }
    addItem(chineseCharacter) {
        this.items.unshift(new GameFieldItem(chineseCharacter));
    }
    checkMerge(item) {
        const collisions = this.items.filter(toCheck => item !== toCheck && item.isCollisionWith(toCheck));
        if (collisions.length === 0)
            return;
        const result = item.mergeWith(collisions);
        if (result === null)
            return;
        const [crafted, merged] = result;
        this.game.unlockItem(crafted.index);
        const position = [...item.position];
        this.items = this.items.filter(item => !merged.includes(item));
        const craftedItem = new GameFieldItem(crafted);
        craftedItem.position[0] = position[0];
        craftedItem.position[1] = position[1];
        this.items.unshift(craftedItem);
    }
    render() {
        const field = this.field;
        field.clear();
        field.strokeStyle = "#fff";
        field.fillStyle = "#222";
        for (const item of [...this.items].reverse()) {
            const { position: [x, y], size } = item;
            field.fillRect(x - size / 2, y - size / 2, size, size);
            field.strokeRect(x - size / 2, y - size / 2, size, size);
            field.fillText({
                x, y,
                text: item.chineseCharacter.glyph,
                color: "#fff",
                font: {
                    fontFamily: "NanumGothic"
                },
                maxWidth: size * 0.2,
                baseline: "middle",
                textAlign: "center",
            });
        }
        field.render();
    }
}
