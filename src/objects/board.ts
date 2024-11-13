import { DIRECTION_MAP, DIRECTION_MIROR, IDirections } from "../types/ITypes"
import Neuro from "./neuro"

type ICell = { 
    neuro: Neuro,
    x: number,
    y: number,
}

/**
 * The board is an hexagonal grid
 * A plan (x,y)
 * the cell (0,0) touch (1,1), (2,0), (1,-1), (0,-2), (-1,-1), (-2,0), (-1,1), (0,2)
 * The cell (0,0) is on the left of the cell (2,0)
 * (2,0) is under (2,2)
 */
class Board {

    private _cells: ICell[] = []

    private _paths: {
        from: number,
        to: number,
        distance: number | undefined,
    }[] = []

    private _hasChanges: boolean = false

    constructor() {
    }

    /**
     * Place a Neuro according to another one
     * @param onBoard 
     * @param newNeuro 
     * @param where 
     * @returns 
     */
    placeNeuroNear(onBoard: Neuro, newNeuro: Neuro, where: IDirections) {
        const ref = this.findNeuro(onBoard)
        if (ref === undefined) throw Error('Could not find onBoardNeuro on Board')

        const coord = {...ref}
        const change = Board.convertDirectionToCoordinate(where)

        coord.x += change.x
        coord.y += change.y

        if (this.getNeuroAt(coord.x, coord.y) !== undefined) throw new Error(`The cell (${coord.x}, ${coord.y}) is not empty`)
        this.placeNeuroAt(newNeuro, coord.x, coord.y)
        return coord
    }

    /**
     * Get the coordinate of a Neuro
     * @param neuro 
     */
    findNeuro(neuro: Neuro) {
        const found = this._cells.find(n => n.neuro === neuro)
        if (!found) return undefined
        return {x: found.x, y: found.y}
    }

    /**
     * Remove a specific neuro
     * @param neuro 
     * @returns 
     */
    removeNeuro(neuro: Neuro) {
        const coordinate = this.findNeuro(neuro)
        if (coordinate) return this.removeNeuroAt(coordinate.x, coordinate.y)
        return undefined
    }

    /**
     * Add a Neuro at specific coordinate
     * Return false is the cell is not empty
     * @param neuro 
     * @param x 
     * @param y 
     * @returns 
     */
    placeNeuroAt(neuro: Neuro, x: number, y: number) {
        this.testCoordinate(x,y)
        if (this.getNeuroAt(x,y) !== undefined) return false
        // First remove neuro if on board
        this.removeNeuro(neuro)
        neuro.onRotate( (() => {
            this._hasChanges = true
        }).bind(this) );
        this._cells.push({
            neuro,
            x,
            y,
        })
        this._hasChanges = true
        return true
    }

    /**
     * Get the neuro located at specific coordinate
     * @param x 
     * @param y 
     * @returns 
     */
    getNeuroAt(x: number, y: number) {
        this.testCoordinate(x,y)
        return this._cells.find(n => n.x === x && n.y === y)?.neuro || undefined
    }

    /**
     * Free the cell and return the Neuro
     * @param x 
     * @param y 
     * @returns 
     */
    removeNeuroAt(x: number, y: number) {
        const ndx = this._cells.findIndex(n => n.x === x && n.y === y)
        if (ndx < 0) return undefined
        this._hasChanges = true
        this._cells[ndx].neuro.onRotate( undefined ); // unbind
        return this._cells.splice(ndx, 1)[0].neuro
    }

    /**
     * Check if several neuro are on the same line or diagonal
     * @param neuros 
     */
    areAligned(neuros: Neuro[]) {
        if (neuros.length === 0) return false
        const coordinates = neuros.map(n => this.findNeuro(n))
        if (coordinates.includes(undefined)) throw new Error('Could not find all neuro of the list')

        const coordinatesClean = (coordinates as {x: number, y: number}[]).map(n => {
            return {
                d: n.x - n.y,
                ...n
            }
        })
        // Same line if same X or same Y
        const sameX = coordinatesClean.filter(n => n.x !== coordinatesClean[0].x)
        if (sameX.length === 0) return true
        const sameY = coordinatesClean.filter(n => n.y !== coordinatesClean[0].y)
        if (sameY.length === 0) return true
        // Same diag if same X-Y
        const sameDiag = coordinatesClean.filter(n => n.d !== coordinatesClean[0].d)
        if (sameDiag.length === 0) return true

        return false
    }

    /**
     * Get path between to neuro
     * @param from 
     * @param to 
     */
    distanceBetween(from: Neuro, to: Neuro) {
        this.updatePaths();
        return this._getPathValue(from.id, to.id)
    }

    /**
     * Throw error is coordinate are not valid
     * @param x 
     * @param y 
     */
    private testCoordinate(x: number, y: number) {
        if (!Board.isAValidCellNumber(x,y)) throw new Error(`Invalid coordinate (${x}, ${y})`)
    }

    /**
     * Update all paths
     */
    private updatePaths() {
        if (!this._hasChanges) return
        
        this._paths.length = 0
        const loop = (parentCell: ICell, currentCell: ICell, visited: number[]) => {
            const neighbour: ICell[] = []
            visited.push(currentCell.neuro.id)
            // Link between First cell to others
            const distanceDone = this._getPathValue(parentCell.neuro.id, currentCell.neuro.id) || 0
            currentCell.neuro.connections.forEach((cnt, ndx) => {
                if (cnt === true) {
                    const change = Board.convertDirectionToCoordinate(DIRECTION_MAP[ndx])
                    const nextNeuro = this.getNeuroAt(currentCell.x + change.x, currentCell.y + change.y)
                    const mirorConnection = DIRECTION_MIROR[ndx]
                    if (nextNeuro && nextNeuro.connections[mirorConnection] === true) {
                        this._setPathValue(currentCell.neuro.id, nextNeuro.id, 1)
                        this._setPathValue(parentCell.neuro.id, nextNeuro.id, distanceDone + 1)

                        if (!visited.includes(nextNeuro.id)) {
                            neighbour.push({
                                neuro: nextNeuro,
                                x: currentCell.x + change.x,
                                y: currentCell.y + change.y,
                            })
                        }
                    }
                }
            })
            neighbour.forEach(n => loop(parentCell, n, visited))
        }
        for(let i = 0; i < this._cells.length; i++) {
            const cell = this._cells[i]
            const visited: number[] = []
            loop( cell, cell, visited )
        }
        this._hasChanges = false;
    }

    /**
     * Find line in this._paths
     */
    private _getPathValue(idFrom: number, idTo: number) {
        const min = Math.min(idFrom, idTo)
        const max = Math.max(idFrom, idTo)
        if (min === max) return 0
        const p = this._paths.find(n => n.from === min && n.to === max)
        if (p) return p.distance
        return undefined
    }

    /**
     * Update this._paths
     */
    private _setPathValue(idFrom: number, idTo: number, value: number = 1) {
        const min = Math.min(idFrom, idTo)
        const max = Math.max(idFrom, idTo)
        if (min === max) return
        const p = this._paths.find(n => n.from === min && n.to === max)
        if (p === undefined) {
            {
                this._paths.push({
                    from: min,
                    to: max, 
                    distance: value,
                })
            }
        } else if (p && (p.distance === undefined || p.distance > value)) p.distance = value
         
    }

    /**
     * Test if the coordinate are valid
     * @param x 
     * @param y 
     * @returns 
     */
    static isAValidCellNumber(x: number, y: number) {
        if ( Math.round(x) !== x || Math.round(y) !== y) return false
        if ( Math.abs(x % 2) !== Math.abs(y % 2) ) return false
        return true
    }

    /**
     * Convert diretion (topleft, left, etc) to (x,y)
     * @param direction 
     * @returns 
     */
    static convertDirectionToCoordinate(direction: IDirections) {
        const coord = {
            x: 0,
            y: 0,
        }
        switch(direction) {
            case 'B':
                coord.y -= 2
            break;
            case 'BL':
                coord.x -= 1
                coord.y -= 1
            break;
            case 'BR':
                coord.x += 1
                coord.y -= 1
            break;
            case 'L':
                coord.x -= 2
            break;
            case 'R':
                coord.x += 2
            break;
            case 'T':
                coord.y += 2
            break;
            case 'TL':
                coord.x -= 1
                coord.y += 1
            break;
            case 'TR':
                coord.x += 1
                coord.y += 1
            break;
        }
        return coord;
    }
}

export default Board