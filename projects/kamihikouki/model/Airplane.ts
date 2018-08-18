import * as CGE from '../../../src/CGE'
import { AirplaneView } from '../view/AirplaneView';
import { App } from '../App';

export class Airplane {

    protected _dir: CGE.Vector3;
    protected _up: CGE.Vector3;

    protected _type: number = 1;

    protected _speed: number = 1;

    protected _view: AirplaneView;

    constructor() {
        // App.instance.cgeApp.getTimer().frameLoop(1, this, this.update);
    }

    public update() {
        let pos = this._view.getPosition();
        pos.add(this._dir);
        this._view.enableUpdateMat();
    }

    public init(type: number = 1) {
        this._type = type;

        this._view = new AirplaneView;
        this._view.init(this._type);

        this._dir = new CGE.Vector3(0, 0.1, 0);
        this._up = new CGE.Vector3(0, 0, 1);
    }

    public getView() {
        return this._view;
    }

    public setPos(x: number, y: number,z: number) {
        this._view.setPosition(x, y, z);
    }

    public getPos(): CGE.Vector3 {
        return this._view.getPosition();
    }

    public setDir(x: number, y: number,z: number) {

    }

    public getDir(): CGE.Vector3 {
        return this._dir;
    }

}