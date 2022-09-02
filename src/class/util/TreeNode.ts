export default class TreeNode<T> {
  value: T;
  private _childs: TreeNode<T>[];
  
  constructor(value: T, childs?: TreeNode<T>[]) {
    this.value = value;
    this._childs = [...(childs ?? [])];
  }

  get childs() {
    return this._childs;
  }

  addChild(child: T | TreeNode<T>) {
    if (child instanceof TreeNode) {
      this._childs.push(child);
    } else {
      this._childs.push(new TreeNode(child));
    }
  }

  arrayify() {
    const arr: any[] = [this.value];
    for (const child of this._childs) {
      arr.push(child.arrayify());
    }
    return arr;
  }
}
