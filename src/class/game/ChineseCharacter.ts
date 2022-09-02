import TreeNode from "../util/TreeNode.js";

interface ChineseCharacterOptions {
  glyph: string;
  index: number;
  strokes: number;
}

export default class ChineseCharacter {
  readonly glyph: string;
  readonly index: number;
  readonly strokes: number;
  private readonly _parents: ChineseCharacter[];
  private readonly _shapes: ChineseCharacter[];

  constructor(options: ChineseCharacterOptions) {
    this.glyph = options.glyph;
    this.index = options.index;
    this.strokes = options.strokes;
    this._parents = [];
    this._shapes = [];
  }
  
  addShape(shape: ChineseCharacter) {
    this._shapes.push(shape);
  }

  addParent(parent: ChineseCharacter) {
    this._parents.push(parent);
  }

  get shapes() {
    return [...this._shapes];
  }

  get parents() {
    return [...this._parents];
  }

  getShapeTree() {
    const tree = new TreeNode(this.glyph);
    for (const shape of this._shapes) {
      tree.addChild(shape.getShapeTree());
    }
    return tree;
  }

  getTier() {
    let tier = 1;
    for (const shape of this._shapes) {
      tier = Math.max(tier, shape.getTier() + 1);
    }
    return tier;
  }
}
