import { Ray } from "../math/Ray";
import { Vector3 } from "../math/Vector3";
import { Vector2 } from "../math/Vector2";
import { Camera, CameraType } from "../object/Camera";
import { Matrix4 } from "../math/Matrix4";
import { Object3D } from "../object/Object3D";
import { Logger } from "../core/Logger";

export interface IntersectObject {
    target: Vector3;
    normal: Vector3;
    object: Object3D;
    distance: number;
}

const vpImat = new Matrix4

/**
 * 射线检测类型
 */
export class Raycaster {

    /**
     * 射线对象
     */
    public ray: Ray

    /**
     * 远距离
     */
    public far: number = Number.MAX_VALUE;

    /**
     * 近距离
     */
    public near: number = 0;

    constructor(ray?: Ray, near: number = 0, far: number = Infinity) {
        if (ray) {
            this.ray = ray.clone()
        } else {
            this.ray = new Ray
        }

        this.near = near;
        this.far = far;
    }

    /**
     * 设置射线属性
     * @param origin 
     * @param dir 
     */
    public setRay(origin: Vector3, dir: Vector3) {
        this.ray.set(origin, dir);
    }

    /**
     * 与物体相交的私有方法
     * @param object 
     * @param intersects 
     * @param recursive 
     */
    protected _intersectObject(object: Object3D, intersects: IntersectObject[] = [], recursive: boolean = true) {
        if (object.visible === false) {
            return intersects;
        }
        object.raycast(this, intersects);
        if (recursive) {
            const children = object.getChildren();
            for (let i = 0, l = children.length; i < l; i++) {
                this._intersectObject(children[i], intersects, recursive);
            }
        }
        return intersects;
    }

    /**
     * 与object相交
     * @param object 
     * @param recursive 
     */
    public intersectObject(object: Object3D, intersects: IntersectObject[] = [], recursive: boolean = true) {
        this._intersectObject(object, intersects, recursive);

        intersects.sort((a, b) => {
            return a.distance - b.distance;
        })

        return intersects;
    }

    /**
     * 通过相机设置射线检测的属性
     * @param coords 
     * @param camera 
     */
    public setFromCamera(coords: Vector2, camera: Camera) {
        const ray = this.ray;
        this.near = camera.near;
        this.far = camera.far;
        if (camera.type === CameraType.Perspective) {
            ray.origin.setFromMatrixPosition(camera.getMatrix());
            vpImat.copy(camera.getViewProjectionMatrix()).invert();
            ray.dir.set(coords.x, coords.y, 0.5).applyMatrix4(vpImat).subAt(ray.origin).normalize();
        } else if (camera.type === CameraType.Orthographic) {
            Logger.warn('通过正交相机设置射线暂时有问题');
            ray.origin.set(coords.x, coords.y, (camera.near + camera.far) / (camera.near - camera.far)).unproject(camera);
            ray.dir.set(0, 0, -1).transformDirection(camera.getMatrix());
        }
    }
}
