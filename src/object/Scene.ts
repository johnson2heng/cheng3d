import { Object3D } from "./Object3D";
import { Camera } from "./Camera";
import { DirectionLight } from "../light/DirectionLight";

export class Scene extends Object3D {
    
    protected _activeCamera: Camera;

    protected _mainLight: DirectionLight = new DirectionLight;

    constructor() {
        super();

        this.addChild(this._mainLight);
        this._mainLight.name = 'mainLight';
        // this._mainLight.enableShadow();
    }

    public getMainLight() {
        return this._mainLight;
    }

    public setActiveCamera(camera: Camera) {
        this._activeCamera = camera;
    }

    public getActiveCamera() {
        return this._activeCamera;
    }

    public get isScene(): boolean {
        return true;
    }
}