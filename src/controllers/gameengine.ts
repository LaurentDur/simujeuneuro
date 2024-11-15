import { GAME_PRESET } from "../config/preset"
import Board from "../objects/board"
import Neuro from "../objects/neuro"
import Player from "../objects/player"
import Project from "../objects/project"
import { IColor, IRoration } from "../types/ITypes"
import { getRotationCandidates, ICellCandidates, listProjectNeuroCandidates, search3ColorsProjectMatch } from "./boardengine"
import { randomPick, selectRandom, shuffleArray } from "./manip"

class GameEngine {
    
    private _players: Player[] = []
    private _neuroDiscard: Neuro[] = []
    private _projectDrawPile: Project[] = []
    private _projectDiscard: Project[] = []
    private _colorDrawPile: {
        color: IColor,
        deck: Neuro[],
    }[] = []
    
    board: Board;

    constructor(nbPLayer: number) {
        this.board = new Board();
        this.initNewGame(nbPLayer)
    }

    /**
     * Get the number of player
     */
    get nbPlayers() {
        return this._players.length
    }

    get players() {
        return Array.from(this._players)
    }

    /**
     * Get neuro for a color Draw pile
     */
    pickNeuro(color: IColor) {
        return randomPick( this.getColorDrawPile(color).deck )
    }

    /**
     * Randomly pick a project from the deck
     */
    pickProject() {
        return randomPick(this._projectDrawPile)
    }

    /**
     * Discard a card
     */
    discard(card: Neuro | Project) {
        if(card instanceof Neuro) this._neuroDiscard.push(card)
        if(card instanceof Project) this._projectDiscard.push(card)
        throw new Error("Invalid type")
    }

    /**
     * Reset all parameters for a new Game
     */
    initNewGame(nbPLayer: number) {
        // Reset discards
        this._projectDiscard.length = 0
        this._neuroDiscard.length = 0

        // Reset board
        this.board = new Board();

        // Init player
        this._players.length = 0;
        Array.from({length: nbPLayer}).forEach(() => {
            this._players.push(new Player())
        })

        // Init Projects
        this._projectDrawPile = Project.generateFullDrawPile();

        // Init Neuro decks
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
        this._colorDrawPile = GAME_PRESET.colors.map( color => {
            const deck = neuroDeck.filter(neuro => neuro.color === color)
            shuffleArray(deck)
            return {
                color,
                deck
            }
        })
    }

    /**
     * Refil the players hands up to GAME_PRESET.handSize.projects  cards.
     */
    phaseDrawProjects() {
        this._players.forEach(player => {
            while( player.handSize  < GAME_PRESET.handSize.projects ) {
                player.addInHand( this.pickProject() )
            }
        })
    }

    /**
     * Each player will pick and place a neuro
     */
    phasePlaceNeuro() {
        this._players.forEach(player => {

            let cndts: ICellCandidates[] = [];
            player.getHand().forEach(project => {
                cndts.push( ...listProjectNeuroCandidates(this.board, project) )
            })
            cndts = cndts.length === 0 ? [] : cndts.filter(n => n.priority === cndts[0].priority)
            // console.log(cndts.length, cndts[0]);

            // Choose a color to pick up
            const selected = selectRandom(cndts)
            // Get neuro in draw pile
            const color = selected.color
            const neuro = this.pickNeuro(color)

            // Choose a free cell
            const cell = selectRandom( cndts.filter(n => n.color === color) )
            
            // Choose the best rotation
            const rotationOptions = cell.connectionNeeds.map(n => {
                const rotas: IRoration[] = []
                n.forEach(d => {
                    getRotationCandidates(neuro, d).forEach(cd => {
                        if (!rotas.includes(cd)) rotas.push(cd)
                    })
                })
                return rotas
            }).sort((a,b) => b.length - a.length)

            let rOptions: IRoration[] = rotationOptions.length === 1 ? 
                                rotationOptions[0] : 
                                rotationOptions[0].filter(n => rotationOptions[1].includes(n));

            if (rOptions.length === 0) rOptions = [0,1,2,3,4,5];
            neuro.rotation = selectRandom(rOptions)
        
            // Place the neuro
            this.board.placeNeuroAt(neuro, cell.x, cell.y)

        })
    }

    /**
     * Check if a project has been completed
     */
    phaseCheckProjectsCompletion() {

        this._players.forEach(player => {
            const opt = player.getHand().filter(project => {
                const ok = search3ColorsProjectMatch(this.board, project)
                return ok.length > 0
            })
            if (opt.length > 0) {
                const prj = selectRandom(opt)
                player.validateProject(prj)
            }
        })

    }

    /** Get the deck of a specific color */
    private getColorDrawPile(color: IColor) {
        return this._colorDrawPile.find(n => n.color === color) || { color, deck: [] }
    }
}

export default GameEngine