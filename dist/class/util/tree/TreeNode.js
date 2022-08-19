"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TreeNode {
    constructor(value, childs) {
        this.value = value;
        this._childs = [...childs];
    }
    get childs() {
        return this._childs;
    }
    addChild(child) {
        this._childs.push(child);
    }
}
exports.default = TreeNode;
