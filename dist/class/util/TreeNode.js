export default class TreeNode {
    constructor(value, childs) {
        this.value = value;
        this._childs = [...(childs ?? [])];
    }
    get childs() {
        return this._childs;
    }
    addChild(child) {
        if (child instanceof TreeNode) {
            this._childs.push(child);
        }
        else {
            this._childs.push(new TreeNode(child));
        }
    }
    arrayify() {
        const arr = [this.value];
        for (const child of this._childs) {
            arr.push(child.arrayify());
        }
        return arr;
    }
}
