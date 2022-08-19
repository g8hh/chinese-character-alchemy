"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Field {
    constructor(options) {
        this.canvasEl = options.canvasEl;
        this._canvasEl = document.createElement("canvas");
        const ctx = this._canvasEl.getContext("2d");
        if (!ctx) {
            throw Error("This browser does not support Canvas");
        }
        this.ctx = ctx;
        this._width = options.size.width;
        this._height = options.size.height;
        this.camera = {
            x: options.camera.x,
            y: options.camera.y,
            zoom: options.camera.zoom
        };
        this.canvasAttr = this.getCanvasAttr();
        this.width = this._width;
        this.height = this._height;
    }
    getCanvasAttr() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            x: this.camera.x,
            y: this.camera.y,
            zoom: this.camera.zoom
        };
    }
    updateCanvasAttr() {
        this.canvasAttr = this.getCanvasAttr();
    }
    getGlobalAttr(localPos) {
        const { x: localX, y: localY, size } = localPos;
        const { x: cameraX, y: cameraY, zoom, width, height } = this.canvasAttr;
        const globalAttr = {
            x: (localX - cameraX) * zoom * Math.min(width, height),
            y: (localY - cameraY) * zoom * Math.min(width, height),
            size: size * zoom * Math.min(width, height)
        };
        if (width > height) {
            globalAttr.x += (width - height) / 2;
        }
        else {
            globalAttr.y += (height - width) / 2;
        }
        return globalAttr;
    }
    set width(value) {
        this._width = value;
        this.canvasEl.width = value;
        this._canvasEl.width = value;
        this.updateCanvasAttr();
    }
    set height(value) {
        this._height = value;
        this.canvasEl.height = value;
        this._canvasEl.height = value;
        this.updateCanvasAttr();
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    set x(value) {
        this.camera.x = value;
        this.updateCanvasAttr();
    }
    set y(value) {
        this.camera.y = value;
        this.updateCanvasAttr();
    }
    set zoom(value) {
        this.camera.zoom = value;
        this.updateCanvasAttr();
    }
    get x() {
        return this.camera.x;
    }
    get y() {
        return this.camera.y;
    }
    get zoom() {
        return this.camera.zoom;
    }
    set strokeStyle(value) {
        this.ctx.strokeStyle = value;
    }
    get strokeStyle() {
        return this.ctx.strokeStyle;
    }
    set fillStyle(value) {
        this.ctx.fillStyle = value;
    }
    get fillStyle() {
        return this.ctx.fillStyle;
    }
    drawLine(x1, y1, x2, y2) {
        const { x: _x1, y: _y1 } = this.getGlobalAttr({ x: x1, y: y1 });
        const { x: _x2, y: _y2 } = this.getGlobalAttr({ x: x2, y: y2 });
        const ctx = this.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(_x1, _y1);
        ctx.lineTo(_x2, _y2);
        ctx.stroke();
        ctx.restore();
    }
    fillRect(x, y, w, h) {
        const { x: _x, y: _y, size: _w } = this.getGlobalAttr({ x, y, size: w });
        const { size: _h } = this.getGlobalAttr({ x: 0, y: 0, size: h });
        this.ctx.fillRect(_x, _y, _w, _h);
    }
    clearRect() {
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    fillCircle(x, y, radius) {
        const { x: _x, y: _y, size: _radius } = this.getGlobalAttr({ x, y, size: radius });
        this.ctx.beginPath();
        this.ctx.arc(_x, _y, _radius, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    render() {
        const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        const ctx = this.canvasEl.getContext("2d");
        if (ctx)
            ctx.putImageData(imageData, 0, 0);
    }
}
exports.default = Field;
