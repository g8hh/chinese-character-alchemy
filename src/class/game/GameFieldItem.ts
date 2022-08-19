import type ChineseCharacter from "./ChineseCharacter.js";

export default class GameFieldItem {
  readonly chineseCharacter: ChineseCharacter;
  readonly position: [x: number, y: number];
  readonly size: number;

  constructor(chineseCharacter: ChineseCharacter) {
    this.chineseCharacter = chineseCharacter;
    this.position = [50 + (Math.random() * 20 - 10), (Math.random() * 20 - 10)];

    const tier = this.chineseCharacter.getTier();
    this.size = 5 + (tier)/2;
  }

  isPointInItem(x: number, y: number) {
    const { position: [xi, yi], size: si } = this;
    const isPointIn =
      xi - si/2 <= x && x <= xi + si/2 &&
      yi - si/2 <= y && y <= yi + si/2;
    return isPointIn;
  }

  isCollisionWith(item: GameFieldItem) {
    const { position: [x1, y1], size: s1 } = this;
    const { position: [x2, y2], size: s2 } = item;

    const isCollision =
      x1 < x2 + s2 &&
      x1 + s1 > x2 &&
      y1 < y2 + s2 &&
      s1 + y1 > y2;
    return isCollision;
  }

  mergeWith(items: GameFieldItem[]): [crafted: ChineseCharacter, merged: GameFieldItem[]] | null {
    const parents = this.chineseCharacter.parents;
    for (const parent of parents) {
      const shapes = parent.shapes;
      const merged = [this, ...items.slice(0, Math.max(1, shapes.length-1))];
      const toCheck = merged.map(item => item.chineseCharacter);
      const canMake = shapes.every(shape => toCheck.includes(shape)) && toCheck.every(shape => shapes.includes(shape));
      if (canMake) return [parent, merged];
    }
    return null;
  }
}
