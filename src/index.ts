import { GAME_PRESET } from "./config/preset";
import { randomPick, shuffleArray } from "./controllers/manip";
import Board from "./objects/board";
import Neuro from "./objects/neuro";
import Project from "./objects/project";
import { IColor } from "./types/ITypes";


const neuroDeck: Neuro[] = []

GAME_PRESET.colors.forEach( color => {
    GAME_PRESET.neuroTypes.forEach( neuroType => {

        Array.from({length: neuroType.weight}).forEach(() => {

            neuroDeck.push( 
                new Neuro({
                    color,
                    connections: neuroType.type
                }) 
            )

        })


    })
})

const colorDecks: {
    color: IColor,
    deck: Neuro[],
}[] = GAME_PRESET.colors.map( color => {
    const deck = neuroDeck.filter(neuro => neuro.color === color)
    shuffleArray(deck)
    return {
        color,
        deck
    }
})



const projectDeck = Project.generateFullDeck()
const pioche = Array.from({length: 25}).map(() => randomPick(projectDeck) )

console.log(pioche)
