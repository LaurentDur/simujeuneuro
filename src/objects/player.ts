import Project from "./project"

let IDCOUNTER = 0

class Player {
    readonly id: number

    private _hand: Project[] = []
    private _completed: Project[] = []

    constructor() {
        this.id = (++IDCOUNTER)
    }

    /**
     * Get number of project in hand
     */
    get handSize() {
        return this._hand.length
    }

    /**
     * List cards in hand
     */
    getHand() {
        return [...this._hand]
    }

    /**
     * Append a project in the player's hand
     */
    addInHand(project: Project) {
        this._hand.push(project)
    }

    /**
     * Remove project from hand and store it in completed list
     */
    validateProject(project: Project) {
        if (this.removeFromHand(project) === false) throw new Error('This project is not in this player\'s hand')
        this._completed.push(project)
    }

    /**
     * Remove the project form this player's hand
     * return false if the project has not been found
     */
    removeFromHand(project: Project) {
        const ndx = this._hand.indexOf(project)
        if (ndx < 0) return false;
        this._hand.splice(ndx, 1)
        return true 
    }
}

export default Player