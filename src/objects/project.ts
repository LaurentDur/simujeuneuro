import { GAME_PRESET } from "../config/preset"
import { IColor } from "../types/ITypes"

let IDCOUNTER = 0

class Project {
    readonly id
    readonly colors: [IColor, IColor, IColor]

    constructor(c1: IColor, c2: IColor, c3: IColor) {
        this.colors = [c1, c2, c3]
        this.id = (++IDCOUNTER)
    }

    static generateFullDeck() {
        const projectDeck: Project[] = []
        GAME_PRESET.colors.forEach(c1 => {
            GAME_PRESET.colors.forEach(c2 => {
                GAME_PRESET.colors.forEach(c3 => {
                    projectDeck.push( new Project(c1, c2, c3) )
                })
            })
        })
        return projectDeck
    }
}

export default Project