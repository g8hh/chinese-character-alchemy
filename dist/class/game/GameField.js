import Field from "../util/Field.js";
import GameFieldItem from "./GameFieldItem.js";
import parseMouseButtons from "../../util/parseMouseButtons.js";
const fontFamilys = ["NanumGothic", "NotoSansSC"];
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
        document.addEventListener("mousedown", (e) => {
            const mouseButton = parseMouseButtons(e, "button");
            this.isMouseDown = true;
            const { x, y } = this.field.globalToLocalAttr({
                x: this.lastPosition[0],
                y: this.lastPosition[1]
            });
            this.selectedItem = this.items.find(item => item.isPointInItem(x, y));
            if (this.selectedItem) {
                const shapes = this.selectedItem.chineseCharacter.shapes;
                if (shapes.length > 0 &&
                    mouseButton.wheelClick) {
                    const [itemX, itemY] = this.selectedItem.position;
                    this.items = this.items.filter(item => item !== this.selectedItem);
                    for (const shape of shapes) {
                        const item = new GameFieldItem(shape);
                        item.position[0] = itemX + Math.random() * 5 - 2.5;
                        item.position[1] = itemY + Math.random() * 5 - 2.5;
                        this.items.unshift(item);
                    }
                    this.selectedItem = undefined;
                }
                else if (mouseButton.rightClick) {
                    this.items = this.items.filter(item => item !== this.selectedItem);
                    this.selectedItem = undefined;
                }
                else {
                    this.items = this.items.filter(item => item !== this.selectedItem);
                    this.items.unshift(this.selectedItem);
                    this.game.list.scrollToItem(this.selectedItem.chineseCharacter.index);
                }
            }
        });
        this.canvasEl.addEventListener("mouseout", () => {
            this.isMouseDown = false;
        });
        this.canvasEl.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });
        document.addEventListener("mouseup", () => {
            this.isMouseDown = false;
            if (this.selectedItem) {
                this.checkMerge(this.selectedItem);
            }
        });
        document.addEventListener("touchstart", (e) => {
            const { pageX, pageY } = e.changedTouches[0];
            this.lastPosition = [pageX, pageY];
            this.isMouseDown = true;
            const { x, y } = this.field.globalToLocalAttr({
                x: this.lastPosition[0],
                y: this.lastPosition[1]
            });
            this.selectedItem = this.items.find(item => item.isPointInItem(x, y));
            if (this.selectedItem) {
                this.items = this.items.filter(item => item !== this.selectedItem);
                this.items.unshift(this.selectedItem);
                this.game.list.scrollToItem(this.selectedItem.chineseCharacter.index);
            }
        });
        document.addEventListener("touchmove", (e) => {
            const { pageX, pageY } = e.changedTouches[0];
            let curPosition = [pageX, pageY];
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
        }, { passive: true });
        document.addEventListener("touchend", () => {
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
        const [craftedArr, merged] = result;
        const position = [...item.position];
        this.items = this.items.filter(item => !merged.includes(item));
        for (const crafted of craftedArr) {
            this.game.unlockItem(crafted.index);
            const craftedItem = new GameFieldItem(crafted);
            craftedItem.position[0] = position[0] + (Math.random() * 4 - 2);
            craftedItem.position[1] = position[1] + (Math.random() * 4 - 2);
            this.items.unshift(craftedItem);
        }
    }
    drawShapeTree(root) {
        const field = this.field;
        const tier = root.getTier();
        field.strokeStyle = "#fff4";
        let prevRow = [];
        let row = [[root, 1]];
        let nextRow = [];
        for (let i = 0; i < tier; i++) {
            let parentIdx = 0;
            let parentWeightAcc = 0;
            let weightAcc = 0;
            for (const item of row) {
                const [chineseCharacter, weight] = item;
                if (chineseCharacter === null) {
                    weightAcc += weight;
                    nextRow.push([null, weight]);
                    continue;
                }
                const x = 10 + 80 * (weightAcc + weight / 2);
                const y = -35 + i * 11;
                field.fillText({
                    x, y,
                    text: chineseCharacter.glyph,
                    color: "#fff4",
                    font: {
                        fontFamilys
                    },
                    maxWidth: 2 * (0.85 - i / 35) ** i,
                    baseline: "middle",
                    textAlign: "center",
                });
                let parent = prevRow[parentIdx];
                if (parent) {
                    while (prevRow.length - 1 > parentIdx &&
                        parentWeightAcc + parent[1] <= weightAcc) {
                        parentWeightAcc += parent[1];
                        parentIdx++;
                        parent = prevRow[parentIdx];
                    }
                    if (parent) {
                        const parentX = 10 + 80 * (parentWeightAcc + parent[1] / 2);
                        const parentY = -35 + (i - 1) * 11;
                        field.drawLine(parentX, parentY + 3, x, y - 3);
                    }
                }
                weightAcc += weight;
                const shapes = chineseCharacter.shapes;
                if (shapes.length > 0) {
                    for (const shape of shapes) {
                        nextRow.push([shape, weight / shapes.length]);
                    }
                }
                else {
                    nextRow.push([null, weight]);
                }
            }
            prevRow = row;
            row = nextRow;
            nextRow = [];
        }
        // Draw parents
        const parents = root.parents;
        const unlocked = this.game.list.unlocked;
        const size = Math.max(1, Math.ceil(Math.sqrt(parents.length)));
        const fontSize = 25 / Math.max(4, size);
        for (let i = 0; i < parents.length; i++) {
            const chineseCharacter = parents[i];
            const text = unlocked.includes(chineseCharacter.index) ? chineseCharacter.glyph : "？";
            const x = 75 + (25 * (i % size) / size);
            const y = -40 + (25 * Math.floor(i / size) / size);
            field.fillText({
                x, y,
                text,
                color: "#fff3",
                font: {
                    fontFamilys
                },
                maxSize: fontSize,
                baseline: "middle",
                textAlign: "center",
            });
        }
    }
    render() {
        const field = this.field;
        field.clear();
        if (this.selectedItem)
            this.drawShapeTree(this.selectedItem.chineseCharacter);
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
                    fontFamilys
                },
                maxWidth: size * 0.2,
                baseline: "middle",
                textAlign: "center",
            });
        }
        field.render();
    }
}
