import { Shadow } from "./Shadow";
import { Texture2D } from "../graphics/Texture2D";
import { Matrix4 } from "../math/Matrix4";

import * as CGE from '../graphics/RendererParameter';
import { LightType } from "./Light";

export class DirectionShadow extends Shadow {

    protected _depthTex: Texture2D;
    protected _size: number = 512;
    public range: number = 200;
    public far: number = 2000;
    public autoRange: boolean = false;
    public matrix: Matrix4 = new Matrix4();

    constructor() {
        super();
    }

    public init(size: number = 512) {
        this._size = size;
        let tex = this._depthTex;
        if (!tex) {
            tex = new Texture2D();
            tex.setDataType(CGE.UNSIGNED_BYTE);
            tex.setFilter(CGE.LINEAR, CGE.LINEAR);
            this._depthTex = tex;
        }
        tex.setSize(size, size);
    }

    public get depthTex(): Texture2D {
        return this._depthTex;
    }

    public set size(n: number) {
        this._size = n;
        this._depthTex && this._depthTex.setSize(n, n);
    }

    public get size(): number {
        return this._size;
    }

    public get type() {
        return LightType.Direction;
    }
}