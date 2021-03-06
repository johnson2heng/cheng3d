import { Vector3 } from './Vector3'
import { Box } from './Box';
import { Sphere } from './Sphere';
import { Triangle } from './Triangle';
import { Matrix4 } from './Matrix4';

/**
 * 射线类型
 * https://github.com/mrdoob/three.js/blob/dev/src/math/Ray.js
 */
export class Ray {

    public origin: Vector3 = new Vector3(0, 0, 0);
    public dir: Vector3 = new Vector3(0, 0, -1);

    /**
     * 
     * @param origin 射线起点
     * @param dir 射线方向
     */
    constructor(origin?: Vector3, dir?: Vector3) {
        origin && this.origin.copy(origin);
        dir && this.dir.copy(dir);
    }

    /**
     * 
     * @param origin 
     * @param dir 
     */
    public set(origin?: Vector3, dir?: Vector3) {
        origin && this.origin.copy(origin);
        dir && this.dir.copy(dir);
    }

    /**
     * 计算并返回，沿着射线方向，距离射线起点距离为t的点坐标
     * @param t
     * @param target 
     */
    public at(t: number, target?: Vector3) {
        if (target === undefined) {
            console.warn('CGE.Ray: .at() target is now required');
            target = new Vector3();
        }
        return target.copy(this.dir).mul(t).addAt(this.origin);
    }

    /**
     * 射线到线段的距离的平方
     * @param v1 
     * @param v2 
     * @param optionalPointOnRay 
     * @param optionalPointOnSegment 
     */
    public distanceSqToSegment(v1: Vector3, v2: Vector3, optionalPointOnRay?: Vector3, optionalPointOnSegment?: Vector3): number { return }

    /**
     * 射线到点的距离平方
     * @param point 
     */
    public distanceSqToPoint(p: Vector3): number { return }

    /**
     * 射线到点的距离
     * @param p 
     */
    public distanceToPoint(p: Vector3): number {
        return Math.sqrt(this.distanceSqToPoint(p));
    }

    /**
     * 与box相交的位置
     * @param box 
     * @param target 
     */
    public intersectBox(box: Box, target?: Vector3): Vector3 {
        const min = box.min;
        const max = box.max;

        let tmin, tmax, tymin, tymax, tzmin, tzmax;

        let invdirx = 1 / this.dir.x,
            invdiry = 1 / this.dir.y,
            invdirz = 1 / this.dir.z;

        let origin = this.origin;

        if (invdirx >= 0) {
            tmin = (min.x - origin.x) * invdirx;
            tmax = (max.x - origin.x) * invdirx;
        } else {
            tmin = (max.x - origin.x) * invdirx;
            tmax = (min.x - origin.x) * invdirx;
        }

        if (invdiry >= 0) {
            tymin = (min.y - origin.y) * invdiry;
            tymax = (max.y - origin.y) * invdiry;
        } else {
            tymin = (max.y - origin.y) * invdiry;
            tymax = (min.y - origin.y) * invdiry;
        }

        if ((tmin > tymax) || (tymin > tmax)) return null;

        // These lines also handle the case where tmin or tmax is NaN
        // (result of 0 * Infinity). x !== x returns true if x is NaN

        if (tymin > tmin || tmin !== tmin) tmin = tymin;
        if (tymax < tmax || tmax !== tmax) tmax = tymax;

        if (invdirz >= 0) {
            tzmin = (min.z - origin.z) * invdirz;
            tzmax = (max.z - origin.z) * invdirz;
        } else {
            tzmin = (max.z - origin.z) * invdirz;
            tzmax = (min.z - origin.z) * invdirz;
        }

        if ((tmin > tzmax) || (tzmin > tmax)) return null;

        if (tzmin > tmin || tmin !== tmin) tmin = tzmin;
        if (tzmax < tmax || tmax !== tmax) tmax = tzmax;

        if (tmax < 0) return null;

        return this.at(tmin >= 0 ? tmin : tmax, target);
    }

    /**
     * 是否与box相交
     * @param box 
     */
    public isIntersectBox(box: Box): boolean { return }

    /**
     * 与球体相交位置
     * @param sphere 
     */
    public instersectSphere(sphere: Sphere): Vector3 { return }

    /**
     * 是否与球相交
     * @param sphere 
     */
    public isInstersectSphere(sphere: Sphere): boolean {
        return this.distanceSqToPoint(sphere.pos) <= (sphere.radius * sphere.radius)
    }

    /**
     * @param triangle
     * @param backfaceCulling 
     * @param target 
     */
    public intersectTriangle(a: Vector3, b: Vector3, c: Vector3, backfaceCulling: boolean, target?: Vector3): boolean { return false; }

    /**
     * 拷贝
     * @param ray 
     */
    public copy(ray: Ray) {
        this.dir.copy(ray.dir);
        this.origin.copy(ray.origin);
        return this;
    }

    /**
     * 克隆
     */
    public clone() {
        const ray = new Ray();
        return ray.copy(this);
    }

    /**
     * 应用矩阵
     */
    public applyMatrix4(matrix: Matrix4) {
        this.origin.applyMatrix4(matrix);
        this.dir.transformDirection(matrix);
    }

    public toJson() {
        return {
            origin: this.origin.toJson(),
            dir: this.dir.toJson()
        };
    }

    public fromJson(obj: any) {
        this.origin.fromJson(obj.origin);
        this.dir.fromJson(obj.dir);
    }
}

Ray.prototype.isIntersectBox = function () {
    const v = new Vector3()

    return function (box: Box) {
        return (this as Ray).intersectBox(box, v) !== null;
    }
}();

Ray.prototype.distanceSqToSegment = function() {

    const segCenter = new Vector3();
	const segDir = new Vector3();
	const diff = new Vector3();

    return function(v0: Vector3, v1: Vector3, optionalPointOnRay?: Vector3, optionalPointOnSegment?: Vector3) {
        // from http://www.geometrictools.com/GTEngine/Include/Mathematics/GteDistRaySegment.h
        // It returns the min distance between the ray and the segment
        // defined by v0 and v1
        // It can also set two optional targets :
        // - The closest point on the ray
        // - The closest point on the segment
        segCenter.copy(v0).addAt(v1).mul(0.5);
        segDir.copy(v1).subAt(v0).normalize();
        diff.copy(this.origin).subAt(segCenter);

        let segExtent = v0.distanceTo(v1) * 0.5;
        let a01 = -this.direction.dot(segDir);
        let b0 = diff.dot(this.direction);
        let b1 = -diff.dot(segDir);
        let c = diff.lengthSquare();
        let det = Math.abs(1 - a01 * a01);
        let s0, s1, sqrDist, extDet;

        if (det > 0) {
            // The ray and segment are not parallel.
            s0 = a01 * b1 - b0;
            s1 = a01 * b0 - b1;
            extDet = segExtent * det;

            if (s0 >= 0) {
                if (s1 >= - extDet) {
                    if (s1 <= extDet) {
                        // region 0
                        // Minimum at interior points of ray and segment.
                        let invDet = 1 / det;
                        s0 *= invDet;
                        s1 *= invDet;
                        sqrDist = s0 * (s0 + a01 * s1 + 2 * b0) + s1 * (a01 * s0 + s1 + 2 * b1) + c;
                    } else {
                        // region 1
                        s1 = segExtent;
                        s0 = Math.max(0, -(a01 * s1 + b0));
                        sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
                    }
                } else {
                    // region 5
                    s1 = -segExtent;
                    s0 = Math.max(0, -(a01 * s1 + b0));
                    sqrDist = -s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;
                }
            } else {
                if (s1 <= - extDet) {
                    // region 4
                    s0 = Math.max(0, -(-a01 * segExtent + b0));
                    s1 = (s0 > 0) ? -segExtent : Math.min( Math.max(-segExtent, -b1), segExtent);
                    sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
                } else if (s1 <= extDet) {
                    // region 3
                    s0 = 0;
                    s1 = Math.min(Math.max(-segExtent, -b1), segExtent);
                    sqrDist = s1 * (s1 + 2 * b1) + c;
                } else {
                    // region 2
                    s0 = Math.max(0, -(a01 * segExtent + b0));
                    s1 = (s0 > 0) ? segExtent : Math.min(Math.max(-segExtent, -b1), segExtent);
                    sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
                }
            }
        } else {
            // Ray and segment are parallel.
            s1 = (a01 > 0) ? -segExtent : segExtent;
            s0 = Math.max(0, -(a01 * s1 + b0));
            sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
        }

        if (optionalPointOnRay) {
            optionalPointOnRay.copy(this.direction).mul(s0).addAt(this.origin);
        }

        if (optionalPointOnSegment) {
            optionalPointOnSegment.copy(segDir).mul(s1).addAt(segCenter);
        }

        return sqrDist;
    }
}()

Ray.prototype.distanceSqToPoint = function () {
    const v = new Vector3

    return function (p: Vector3) {
        const directionDistance = v.subBy(p, this.origin).dot(this.dir);

        if (directionDistance < 0) {
            return this.origin.distanceToSquare(p);
        }

        v.copy(this.dir).mul(directionDistance).addAt(this.origin);
        return v.distanceToSquare(p);
    }
}();

Ray.prototype.instersectSphere = function () {
    const v1 = new Vector3

    return function (sphere: Sphere, target?: Vector3) {
        v1.subBy(sphere.pos, (this as Ray).origin);
        const tca = v1.dot((this as Ray).dir);
        const d2 = v1.dot(v1) - tca * tca;
        const radius2 = sphere.radius * sphere.radius;

        if (d2 > radius2) return null;

        const thc = Math.sqrt(radius2 - d2);

        const t0 = tca - thc;
        const t1 = tca + thc;

        if (t0 < 0 && t1 < 0) return null;

        if (t0 < 0) return (this as Ray).at(t1, target);
        return (this as Ray).at(t0, target);
    }
}();

/**
 * https://github.com/mrdoob/three.js/blob/dev/src/math/Ray.js
 */
Ray.prototype.intersectTriangle = function () {
    const diff = new Vector3
    const edge1 = new Vector3
    const edge2 = new Vector3
    const normal = new Vector3

    return function (a: Vector3, b: Vector3, c: Vector3, backfaceCulling: boolean, target?: Vector3) {

        edge1.copy(b).subAt(a);
        edge2.copy(c).subAt(a);
        normal.crossBy(edge1, edge2);

        // Solve Q + t*D = b1*E1 + b2*E2 (Q = kDiff, D = ray direction,
        // E1 = kEdge1, E2 = kEdge2, N = Cross(E1,E2)) by
        //   |Dot(D,N)|*b1 = sign(Dot(D,N))*Dot(D,Cross(Q,E2))
        //   |Dot(D,N)|*b2 = sign(Dot(D,N))*Dot(D,Cross(E1,Q))
        //   |Dot(D,N)|*t = -sign(Dot(D,N))*Dot(Q,N)

        let DdN: number = this.dir.dot(normal);
        let sign: number;

        if (DdN > 0) {
            if (backfaceCulling) return false;
            sign = 1;
        } else if (DdN < 0) {
            sign = -1;
            DdN = -DdN;
        } else {
            return false;
        }

        diff.subBy(this.origin, a);
        let DdQxE2: number = sign * this.dir.dot(edge2.crossBy(diff, edge2));

        // b1 < 0, no intersection
        if (DdQxE2 < 0) {
            return false;
        }

        let DdE1xQ: number = sign * this.dir.dot(edge1.cross(diff));

        // b2 < 0, no intersection
        if (DdE1xQ < 0) {
            return false;
        }

        // b1+b2 > 1, no intersection
        if (DdQxE2 + DdE1xQ > DdN) {
            return false;
        }

        // Line intersects triangle, check whether ray does.
        let QdN: number = -sign * diff.dot(normal);

        // t < 0, no intersection
        if (QdN < 0) {
            return false;
        }

        this.at(QdN / DdN, target);

        return true;
    }
}();
