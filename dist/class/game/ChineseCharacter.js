import TreeNode from "../util/TreeNode.js";
export default class ChineseCharacter {
    constructor(options) {
        this.glyph = options.glyph;
        this.index = options.index;
        this.strokes = options.strokes;
        this._parents = [];
        this._shapes = [];
    }
    addShape(shape) {
        this._shapes.push(shape);
    }
    addParent(parent) {
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
