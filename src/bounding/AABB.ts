import { Bounding } from './Bounding';
import { OBB } from './OBB';
import { Sphere } from './Sphere';
import { Vector3 } from '../math/Vector3';
import { Matrix4 } from '../math/Matrix4';

export class AABB extends Bounding {
    protected _min: Vector3 = new Vector3();
    protected _max: Vector3 = new Vector3();

    constructor() {
        super();
    }

    public makeFrom(src: AABB, mat: Matrix4) {
        this._max.set(-Infinity, -Infinity, -Infinity);
        this._min.set(Infinity, Infinity, Infinity);

        let aux = Bounding._auxVec;

        for (let k = 0; k < 2; k++) {
            for (let j = 0; j < 2; j++) {
                for (let i = 0; i < 2; i++) {
                    aux.set(
                        i === 1 ? src._max.x : src._min.x, 
                        j === 1 ? src._max.x : src._min.x, 
                        k === 1 ? src._max.x : src._min.x
                    );

                    aux.applyMatrix4(mat);
                    this._max.max(aux);
                    this._min.min(aux);
                }
            }
        }
    }

    public intersect(bounding: Bounding) {
        const type = bounding.getType();
        switch(type) {
            case Bounding.TYPE_SPHERE:
                return Bounding.intersectSphereToAABB(<Sphere>bounding, this);
            case Bounding.TYPE_AABB:
                return Bounding.intersectAABB(<AABB>bounding, this);
            case Bounding.TYPE_OBB:
                return Bounding.intersectOBBToAABB(<OBB>bounding, this);
            default:
                return false;
        }
    }

    public setMin(x: number, y: number, z: number) {
        this._min.set(x, y, z);
    }

    public setMinAt(vec: Vector3) {
        this._min.setAt(vec);
    }

    public setMax(x: number, y: number, z: number) {
        this._max.set(x, y, z);
    }

    public setMaxAt(vec: Vector3) {
        this._max.setAt(vec);
    }

    public getMin() {
        return this._min;
    }

    public getMax() {
        return this._max;
    }

    public getType() {
        return Bounding.TYPE_AABB;
    }

    public copy(aabb: AABB) {
        this._min.copy(aabb._min);
        this._max.copy(aabb._max);
    }
}