import Project from "./project"

let IDCOUNTER = 0

class Player {
    readonly id: number

    private _hand: Project[] = []

    constructor() {
        this.id = (++IDCOUNTER)
    }

    /**
     * List cards in hand
     */
    getHand() {
        return [...this._hand]
    }

    addInHand(project: Project) {
        this._hand.push(project)
    }

    removeFromHand(project: Project) {
        const ndx = this._hand.indexOf(project)
        if (ndx >= 0) this._hand.splice(ndx, 1)
    }
}

export default Player