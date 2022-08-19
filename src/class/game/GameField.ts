import Field from "../util/Field.js";
import GameFieldItem from "./GameFieldItem.js";
import type ChineseCharacter from "./ChineseCharacter.js";
import type Game from "./Game.js";

export interface GameFieldOptions {
  canvasWrapper: HTMLElement;
  canvas: HTMLCanvasElement;
}

export default class GameField {
  private readonly game: Game;
  private items: GameFieldItem[];
  private readonly field: Field;
  readonly canvasEl: HTMLCanvasElement;
  private isMouseDown: boolean;
  private selectedItem: GameFieldItem | undefined;
  private lastPosition: [x: number, y: number];

  constructor(game: Game, options: GameFieldOptions) {
    this.game = game;
    this.items = [];
    this.field = new Field({
      camera: {
        x: 0,
        y: -50,
        zoom: 1/100
      },
      size: options.canvasWrapper,
      canvasEl: options.canvas
    });

    this.canvasEl = options.canvas;
    this.isMouseDown = false;
    this.selectedItem = undefined;
    this.lastPosition = [0, 0];

    this.canvasEl.addEventListener("mousemove", (e) => {
      let curPosition: [x: number, y: number] = [e.offsetX, e.offsetY];
      
      if (
        this.isMouseDown &&
        this.selectedItem
      ) {
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
  
  addItem(chineseCharacter: ChineseCharacter) {
    this.items.unshift(new GameFieldItem(chineseCharacter));
  }

  checkMerge(item: GameFieldItem) {
    const collisions = this.items.filter(toCheck => item !== toCheck && item.isCollisionWith(toCheck));
    if (collisions.length === 0) return;
    const result = item.mergeWith(collisions);
    if (result === null) return;
    const [crafted, merged] = result;
    this.game.unlockItem(crafted.index);
    const position = [...item.position];
    this.items = this.items.filter(item => !merged.includes(item));

    const craftedItem = new GameFieldItem(crafted);
    craftedItem.position[0] = position[0];
    craftedItem.position[1] = position[1];
    this.items.unshift(craftedItem);
  }

  private drawShapeTree(root: ChineseCharacter) {
    const field = this.field;
    const tier = root.getTier();

    type TreeRow = [chineseCharacter: ChineseCharacter | null, weight: number][];

    field.strokeStyle = "#fff4";

    let prevRow: TreeRow = [];
    let row: TreeRow = [[root, 1]];
    let nextRow: TreeRow = [];

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
        const y = -40 + i * 11;
        field.fillText({
          x, y,
          text: chineseCharacter.glyph,
          color: "#fff4",
          font: {
            fontFamily: "NanumGothic"
          },
          maxWidth: 2 * (0.85 - i/35)**i,
          baseline: "middle",
          textAlign: "center",
        });

        let parent = prevRow[parentIdx];
        if (parent) {
          while (
            prevRow.length - 1 > parentIdx &&
            parentWeightAcc + parent[1] <= weightAcc
          ) {
            parentWeightAcc += parent[1];
            parentIdx++;
            parent = prevRow[parentIdx];
          }
          if (parent) {
            const parentX = 10 + 80 * (parentWeightAcc + parent[1] / 2);
            const parentY = -40 + (i - 1) * 11;
            field.drawLine(parentX, parentY + 3, x, y - 3);
          }
        }

        weightAcc += weight;
        const shapes = chineseCharacter.shapes;
        if (shapes.length > 0) {
          for (const shape of shapes) {
            nextRow.push([shape, weight/shapes.length]);
          }
        } else {
          nextRow.push([null, weight]);
        }
      }

      prevRow = row;
      row = nextRow;
      nextRow = [];
    }
  }

  render() {
    const field = this.field;
    field.clear();

    if (this.selectedItem) this.drawShapeTree(this.selectedItem.chineseCharacter);

    field.strokeStyle = "#fff";
    field.fillStyle = "#222";

    for (const item of [...this.items].reverse()) {
      const { position: [x, y], size } = item;
      field.fillRect(x - size/2, y - size/2, size, size);
      field.strokeRect(x - size/2, y - size/2, size, size);
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
