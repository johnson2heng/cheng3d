import { glObject } from './glObject'
import { glDraw, glDrawWithIndex } from './glDraw'

export class glBuffer extends glObject {
    _vbos = [];
    _ibo = undefined;
    _draw = undefined;

    constructor() {
        super();
    }

    private _createBufferFromData(gl, target, data, usage) {
        let buffer = gl.createBuffer();
        gl.bindBuffer(target, buffer);
        gl.bufferData(target, data, usage);
        gl.bindBuffer(target, null);
        return buffer;
    }

    public generateFromGeometry(gl, geometry) {
        // let version = geometry.getUpdateVersion();
        let attributeDatas = geometry.getAttributeDatas();
        let indexData = geometry.getIndexData();
        let drawParameter = geometry.getDrawParameter();

        if (attributeDatas.length === 0) {
            return undefined;
        }
        
        attributeDatas.forEach(function(attribute){
            let vbo = this._createBufferFromData(gl, gl.ARRAY_BUFFER, attribute.data, attribute.usage);
            this._vbos.push(vbo);
        }.bind(this));

        if (geometry._indexData) {
            this._ibo = this._createBufferFromData(gl, gl.ELEMENT_ARRAY_BUFFER, indexData.data, indexData.usage);
            this._draw = new glDrawWithIndex(drawParameter.mode, drawParameter.offset, drawParameter.count, indexData.type, this._ibo);
        } else {
            this._draw = new glDraw(drawParameter.mode, drawParameter.offset, drawParameter.count, 0);
        }
        
        // this.setLocalVersion(version);
        this._update = false;
        return this;
    }

    public getVbos() {
        return this._vbos;
    }

    public getIbo() {
        return this._ibo;
    }

    public getDraw() {
        return this._draw;
    }

    public draw(gl) {
        this._draw.apply(gl);
    }
}
