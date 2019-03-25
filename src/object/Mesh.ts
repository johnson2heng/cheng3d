import { Object3D } from "./Object3D";
import { Geometry } from "../graphics/Geometry";
import { Material } from "../material/Material";
import { Raycaster, IntersectObject } from "../util/RayCaster";

export class Mesh extends Object3D {
    protected _geometry: Geometry;
    protected _material: Material;

    public castShadow: boolean = true;
    public receiveShadow: boolean = true;

    constructor() {
        super();
    }

    public setGeometry(geo: Geometry) {
        if (this._geometry) {
            this._geometry.destroy();
        }
        this._geometry = geo;
    }

    public getGeometry(): Geometry {
        return this._geometry;
    }

    public setMaterial(mat: Material) {
        if (this._material) {
            this._material.destroy();
        }
        this._material = mat;
    }

    public getMaterial() {
        return this._material;
    }

    public beRendering(): boolean {
        return !(!this._geometry || !this._material);
    }

    protected _updateBounding() {
        let bounding = this._geometry.getBounding();
        if (!bounding) {
            return;
        }
        if (this._bounding && this._bounding.getType() === bounding.getType()) {
            this._bounding.copy(bounding);
            this._bounding.applyMatrix(this._matrix);
        } else {
            this._bounding = bounding.clone();
            this._bounding.applyMatrix(this._matrix);
        }
    }

    public raycast(raycaster: Raycaster, intersects?: IntersectObject[]) {

    }

    public get isMesh(): boolean {
        return true;
    }

    protected _destroy() {
        if (this._material) {
            this._material.destroy();
        }

        if (this._geometry) {
            this._geometry.destroy();
        }
    }
}