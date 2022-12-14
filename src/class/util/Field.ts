interface FieldOptions {
  canvasEl: HTMLCanvasElement;
  size: HTMLElement | {
    width: number;
    height: number;
  };
  camera: Camera;
}
interface Camera {
  x: number;
  y: number;
  zoom: number;
}

interface FillTextOptions {
  text: string;
  x: number;
  y: number;
  color: string;
  font: {
    bold?: boolean;
    fontFamilys: string[]
  }
  maxSize?: number;
  maxWidth?: number;
  textAlign?: CanvasRenderingContext2D["textAlign"];
  baseline?: CanvasRenderingContext2D["textBaseline"];
  ignoreCamera?: boolean;
}

export interface BaseAttrs {
  x: number;
  y: number;
}
export interface ObjectAttrs extends BaseAttrs {
}
export interface ObjectAttrsWithSize extends BaseAttrs {
  size: number;
}
export interface GlobalAttrs extends BaseAttrs {
  width: number;
  height: number;
  zoom: number;
}

export default class Field {
  canvasEl: HTMLCanvasElement;
  canvasWrapper: HTMLElement | undefined;
  private readonly _canvasEl: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private canvasAttr: GlobalAttrs;
  private _width: number;
  private _height: number;
  private readonly camera: Camera;

  constructor(options: FieldOptions) {
    this.canvasEl = options.canvasEl;
    this._canvasEl = document.createElement("canvas");
    const ctx = this._canvasEl.getContext("2d");
    if (!ctx) {
      throw Error("This browser does not support Canvas");
    }
    this.ctx = ctx;
    if (options.size instanceof HTMLElement) {
      this.canvasWrapper = options.size;
      this._width = this.canvasWrapper.offsetWidth;
      this._height = this.canvasWrapper.offsetHeight;
    } else {
      this.canvasWrapper = undefined;
      this._width = options.size.width;
      this._height = options.size.height;
    }

    this.camera = {
      x: options.camera.x,
      y: options.camera.y,
      zoom: options.camera.zoom
    };

    this.canvasAttr = this.getCanvasAttr();

    this.width = this._width;
    this.height = this._height;

    window.addEventListener("resize", () => {
      if (!this.canvasWrapper) return;
      this.width = this.canvasWrapper.offsetWidth;
      this.height = this.canvasWrapper.offsetHeight;
    });
  }

  private getCanvasAttr(): GlobalAttrs {
    return {
      width: this.width,
      height: this.height,
      x: this.camera.x,
      y: this.camera.y,
      zoom: this.camera.zoom
    };
  }

  private updateCanvasAttr() {
    this.canvasAttr = this.getCanvasAttr();
  }

  localToGlobalAttr<T extends ObjectAttrs | ObjectAttrsWithSize>(localAttr: T): T {
    const { x: localX, y: localY, size } = localAttr as ObjectAttrsWithSize;
    const { x: cameraX, y: cameraY, zoom, width, height } = this.canvasAttr;
  
    const globalAttr: ObjectAttrsWithSize = {
      x: (localX-cameraX)*zoom*Math.min(width, height),
      y: (localY-cameraY)*zoom*Math.min(width, height),
      size: size*zoom*Math.min(width, height)
    };
    if (width > height) {
      globalAttr.x += (width-height)/2;
    } else {
      globalAttr.y += (height-width)/2;
    }
    return globalAttr as any;
  }

  globalToLocalAttr(globalAttr: BaseAttrs): BaseAttrs {
    const { width, height } = this;
    const { x, y } = globalAttr;
    const { x: cameraX, y: cameraY, zoom } = this.camera;
    const offset: BaseAttrs = {
      x: 0,
      y: 0
    };
    if (width > height) {
      offset.x -= (width-height)/2;
    } else {
      offset.y -= (height-width)/2;
    }
    const pos: BaseAttrs = {
      x: (x+offset.x)/Math.min(width, height)/zoom+cameraX,
      y: (y+offset.y)/Math.min(width, height)/zoom+cameraY
    };
    return pos;
  }

  set width(value: number) {
    this._width = value;
    this.canvasEl.width = value;
    this._canvasEl.width = value;
    this.updateCanvasAttr();
  }

  set height(value: number) {
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

  set x(value: number) {
    this.camera.x = value;
    this.updateCanvasAttr();
  }

  set y(value: number) {
    this.camera.y = value;
    this.updateCanvasAttr();
  }

  set zoom(value: number) {
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

  set strokeStyle(value: string | CanvasGradient | CanvasPattern) {
    this.ctx.strokeStyle = value;
  }

  get strokeStyle() {
    return this.ctx.strokeStyle;
  }

  set fillStyle(value: string | CanvasGradient | CanvasPattern) {
    this.ctx.fillStyle = value;
  }

  get fillStyle() {
    return this.ctx.fillStyle;
  }

  drawLine(x1: number, y1: number, x2: number, y2: number) {
    const { x: _x1, y: _y1 } = this.localToGlobalAttr({ x: x1, y: y1 });
    const { x: _x2, y: _y2 } = this.localToGlobalAttr({ x: x2, y: y2 });
    const ctx = this.ctx;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(_x1, _y1);
    ctx.lineTo(_x2, _y2);
    ctx.stroke();
    ctx.restore();
  }

  strokeRect(x: number, y: number, w: number, h: number) {
    const { x: _x, y: _y, size: _w } = this.localToGlobalAttr({ x, y, size: w });
    const { size: _h } = this.localToGlobalAttr({ x: 0, y: 0, size: h });
    
    this.ctx.beginPath();
    this.ctx.rect(_x, _y, _w, _h);
    this.ctx.stroke();
  }

  fillRect(x: number, y: number, w: number, h: number) {
    const { x: _x, y: _y, size: _w } = this.localToGlobalAttr({ x, y, size: w });
    const { size: _h } = this.localToGlobalAttr({ x: 0, y: 0, size: h });
    
    this.ctx.fillRect(_x, _y, _w, _h);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  fillCircle(x: number, y: number, radius: number) {
    const { x: _x, y: _y, size: _radius } = this.localToGlobalAttr({ x, y, size: radius });

    this.ctx.beginPath();
    this.ctx.arc(_x, _y, _radius, 0, 2*Math.PI);
    this.ctx.fill();
  }

  fillText(options: FillTextOptions) {
    const ctx = this.ctx;
    const {
      text, font: { bold, fontFamilys }, color, x, y,
      maxSize=Infinity, maxWidth=Infinity, baseline="alphabetic", textAlign="left"
    } = options;

    ctx.save();

    const localAttr1 = { x, y, size: maxWidth };
    const localAttr2 = { x, y, size: maxSize };
    const globalAttr = this.localToGlobalAttr(localAttr1);
    const fontSize = Math.min(globalAttr.size/text.length*3, this.localToGlobalAttr(localAttr2).size);

    ctx.fillStyle = color;
    ctx.textBaseline = baseline;
    ctx.textAlign = textAlign;
    ctx.font = (bold ? "bold " : "") + `${fontSize}px ${fontFamilys.map(v => `"${v}"`).join(", ")}`;
    ctx.fillText(text, globalAttr.x, globalAttr.y);

    ctx.restore();
  }

  render() {
    const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    const ctx = this.canvasEl.getContext("2d");
    if (ctx) ctx.putImageData(imageData, 0, 0);
  }
}
