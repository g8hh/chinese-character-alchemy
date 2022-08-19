import TreeNode from "../util/TreeNode.js";
export default class Glyph {
    constructor(options) {
        this.glyph = options.glyph;
        this.strokes = options.strokes;
        this.shapes = [...options.shapes];
        Object.freeze(this.shapes);
    }
    getShapeTree() {
        const tree = new TreeNode(this.glyph);
        for (const shape of this.shapes) {
            tree.addChild(shape.getShapeTree());
        }
        return tree;
    }
}
