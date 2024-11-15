import { rotateArray } from "../controllers/manip";
import { IColor, IConnections, IRoration } from "../types/ITypes";

let IDCOUNTER = 0
type IRotateListener = (neuro: Neuro) => void

class Neuro {

    private _id: number
    private _connections: IConnections
    private _color: IColor
    private _rotation: IRoration = 0
    private _overclocked: boolean = false

    private _curConnections: IConnections

    private _rotateListener: IRotateListener | undefined = undefined

    constructor({connections, color}: {connections: IConnections , color: IColor}) {
        this._connections = Array.from(connections) as IConnections
        this._curConnections = Array.from(connections) as IConnections
        this._color = color
        this._id = (++IDCOUNTER)
    }

    // GETTER 
    get color() {
        return this._color
    }

    get id() {
        return this._id
    }

    // GETTER SETTER
    set rotation(rotation: IRoration) {
        this._rotation = rotation
        // Update connection according to rotation
        const temp = Array.from(this._connections) as IConnections
        rotateArray<boolean>( temp, rotation)
        this._curConnections = temp
        // Trigger rotation listener
        if (this._rotateListener !== undefined) {
            this._rotateListener(this)
        }
    }
    get rotation(): IRoration {
        return this._rotation
    }

    set overclocked(val: boolean) {
        this._overclocked = val
    }
    get overclocked() {
        return this._overclocked
    }

    // Get connection according to current rotation
    get connections(): IConnections {
        if (this._overclocked) return [true,true,true,true,true,true]
        return Array.from(this._curConnections) as IConnections
    }

    /**
     * Get connection with rotation = 0
     */
    getRawConnections() {
        return Array.from(this._connections)
    }

    // Listener
    onRotate(fct: IRotateListener | undefined) {
        this._rotateListener = fct
    }


}

export default Neuro