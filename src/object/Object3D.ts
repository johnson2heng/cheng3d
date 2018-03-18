import { Vector3 } from '../math/Vector3';
import { Quaternion } from '../math/Quaternion';
import { Matrix4 } from '../math/Matrix4';
import { Base } from '../core/Base';
import { Component } from '../CGE';

export class Object3D extends Base {
    protected _position: Vector3 = new Vector3();
    protected _rotate: Quaternion = new Quaternion();
    protected _scale: Vector3 = new Vector3(1, 1, 1);
    protected _matrix: Matrix4 = new Matrix4();
    protected _needsUpdate: boolean = true;
    protected _display: boolean = true;
    protected _components: Component[] = [];

    protected _parent: Object3D = null;
    protected _children: Object3D[] = [];

    constructor() {
        super();
    }

    public addChild(child: Object3D) {
        if (child && child._parent !== this) child.setParent(this);
    }

    public removeChild(child: Object3D) {
        if (child && child._parent === this) child.setParent(null);
    }

    public setNeedUpdateMatrix() {
        this._needsUpdate = true;
    }

    public update(delta: number) {
        this.makeMatrix();
    }

    public setPosition(position: Vector3) {
        this._position.set(position.x, position.y, position.z);
        this.setNeedUpdateMatrix();
    }

    public setPositionValue(x: number, y: number, z: number) {
        this._position.set(x, y, z);
        this.setNeedUpdateMatrix();
    }

    public getPosition() {
        return this._position;
    }

    public setRotate(rotate: Quaternion) {
        this._rotate.set(rotate.x, rotate.y, rotate.z, rotate.w);
        this.setNeedUpdateMatrix();
    }

    public getRotate() {
        return this._rotate;
    }

    public setScale(scale: Vector3) {
        this._scale.set(scale.x, scale.y, scale.z);
        this.setNeedUpdateMatrix();
    }

    public getScale() {
        return this._scale;
    }

    public getMatrix() {
        this.makeMatrix();
        return this._matrix;
    }

    public makeMatrix() {
        if (this._needsUpdate) {
            this._matrix.compose(this._position, this._rotate, this._scale);
            this._needsUpdate = false;
        }
    }

    public setParent(parent: Object3D) {
        if (this._parent === parent) return;
        if (this._parent) {
            let children = this._parent._children;
            children.splice(1, children.indexOf(this));
        }
        if (parent) {
            parent._children.push(this);
        }
        this._parent = parent;
    }

    public getParent() {
        return this._parent;
    }
}