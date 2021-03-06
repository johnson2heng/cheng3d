import { Light, LightType, ILight } from "./Light";
import { Vector3 } from "../math/Vector3";
import { Quaternion } from "../math/Quaternion";
import { AABB } from "../bounding/AABB";
import { SpotShadow } from "./SpotShadow";

export class SpotLight extends Light implements ILight {

    protected _dir: Vector3 = new Vector3();
    protected _angle: number = 0.0;
    protected _radius: number;
    
    protected _shadow: SpotShadow;

    constructor() {
        super();
        this._bounding = new AABB();
        this.setFactor(0.9375);
    }

    public setDir(x:number, y: number, z: number) {
        let vec = Vector3.pubTemp.set(x, y, z).normalize();
        this.setDirection(vec);
    }
    
    public setDirection(dir: Vector3) {
        this._rotate.rotationTo(Light.DefDir, dir);

        this._dir.set(0, 0, 1);
        this._dir.applyQuaternion(this._rotate).normalize();
    }

    public setRotate(x, y, z, w) {
        super.setRotate(x, y, z, w);
        this._dir.set(0, 0, -1).applyQuaternion(this._rotate);
    }

    public setRotateAt(q: Quaternion) {
        super.setRotateAt(q);
        this._dir.set(0, 0, -1).applyQuaternion(this._rotate);
    }

    public setColor(r: number, g: number, b: number) {
        super.setColor(r, g, b);
        // let lum = Light.LumFactor.dot(this._color);
        // 这里计算亮度衰减到1 / 256的时的半径;
        // this._radius = Math.sqrt(lum) * 16.0;
    }
    
    public setFactor(v: number) {
        this.color.w = Math.min(v, 1.0);
        this._radius = Math.sqrt(1.0 / (1.0 - v));
    }

    protected _updateBounding() {
        let angle = this._angle;
        let bounding = this._bounding as AABB;
        let radius = this._radius;
        if (angle <= Math.PI * 0.5) {
            let sin = Math.sin(angle);
            let r = sin * radius;
            bounding.setMax(r, r, 0);
            bounding.setMin(-r, -r, -radius);
        } else {
            let cos = Math.cos(angle);
            bounding.setMax(radius, radius, -cos * radius);
            bounding.setMax(-radius, -radius, -radius);
        }
        this._bounding.applyMatrix(this._matrix);
    }

    public get type() {
        return LightType.Spot;
    }

    public enableShadow() {
        if (!this._shadow) {
            this._shadow = new SpotShadow();
            this._shadow.init();
        }
        this._shadow.enalbed = true;
    }

    public disableShadow() {
        if (!this._shadow) {
            return;
        }
        this._shadow.enalbed = false;
    }

    public clearShadow() {
        if (this._shadow) {
            this._shadow.destroy();
            this._shadow = null;
        }
    }

    public get shadow() {
        return this._shadow;
    }

    set angle(v: number) {
        this._angle = v;
    }

    get angle() {
        return this._angle;
    }

    get dir() {
        return this._dir;
    }

    get radius() {
        return this._radius;
    }

    get isSpotLight() {
        return false;
    }    
}
