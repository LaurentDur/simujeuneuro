/**
 * This file provides function to analyse the board and propose 
 * options.
 */
import Board, { ICell } from "../objects/board";
import Neuro from "../objects/neuro";
import Project from "../objects/project";
import { DIRECTION_MAP, DIRECTION_MIROR, IColor, IConnections, IDirections, IRoration } from "../types/ITypes";
import { drawBoard } from "./draw";



export type ICellCandidates = {
    x: number,
    y: number,
    color: IColor,
    connectionNeeds: IDirections[][],
    priority: number,
    explain: string,
}

/**
 * Get all possible rotation that enable a connection in target direction   
 * @param board 
 * @param cell 
 * @param neuro 
 */
export function getRotationCandidates(neuro: Neuro, connectionDirection: IDirections): IRoration[] {
    const ndx = DIRECTION_MAP.indexOf(connectionDirection)
    if (ndx < 0) return []

    const base = neuro.overclocked ?  neuro.connections : neuro.getRawConnections()
    return base.map((c, i) => {
        if (c === false) return undefined
        const delta = ndx - i;
        return (delta < 0 ? 6 + delta : delta) as IRoration
    }).filter(c => c !== undefined)
}


/**
 * List all pair of cells that can be used to complete a project 
 * that means that a free cell should be available
 * @param board 
 * @param project 
 */
export function listProjectNeuroCandidates(board: Board, project: Project): ICellCandidates[] {
    const colors = project.colors

    // Take middle project color.
    // List all of them with AND empty cell
    // first connected and last color connected (at 0 move to complete)
    // first connected and last color NOTconnected (at 1.5 move to complete - rotate)
    // first NOTconnected and last color NOTconnected (at 3 move to complete - 2xrotate)
    // first connected or last color connected and empty slot (at 1 move to complete)
    // first NOTconnected or last color NOTconnected and empty slot (at 2.5 move to complete - place and rotate)
    // 2 empty slots (at 2 moves to complete)

    const emptyCells = board.listAvailableCells()
    const cells = board.cells.filter(c => c.neuro.color === colors[1] )

    const exploreFrom: (Omit<ICell,'neuro'> & {neuro?: Neuro})[] = [...cells, ...(emptyCells.map(n => {
        return {
            x: n.x,
            y: n.y,
            neuro: undefined
        }
    }))]

    const list: ICellCandidates[] = []

    const pushInList = (entry: ICellCandidates) => {
        const ndx = list.findIndex(n => n.x === entry.x && n.y === entry.y)
        if (ndx < 0) list.push(entry);
        else if(list[ndx].priority > entry.priority) {
            list[ndx] = entry
        }
    }

    // Search for ready projects
    exploreFrom.forEach(cell => {
        const neighbors = board.neighborOf(cell.x, cell.y).filter(n => {
            if (!cell.neuro) return true;
            const ndx = DIRECTION_MAP.indexOf(n.direction)
            return cell.neuro.connections[ndx]
        })

        const prevColor = neighbors.filter(n => n.neuro && n.neuro.color === colors[0])
        const nextColor = neighbors.filter(n => n.neuro && n.neuro.color === colors[2])

        if (prevColor.length > 0 && nextColor.length > 0) {
            if (cell.neuro === undefined) {
                // Empty cell with good colors around
                pushInList({
                    x: cell.x,
                    y: cell.y,
                    color: colors[1],
                    connectionNeeds: [ prevColor.map(n => n.direction), nextColor.map(n => n.direction)],
                    priority: 1 + (prevColor.filter(n => n.connected).length > 0 ? 0 : 1.5) + (nextColor.filter(n => n.connected).length > 0 ? 0 : 1.5),
                    explain: 'Empty cell with good colors around'
                })
            } else {
                // Fill up cell with good colors around
                const hasEmpty = neighbors.filter(n => n.neuro === undefined)
                
                hasEmpty.forEach(ncell => {
                    const dndx = DIRECTION_MAP.indexOf(ncell.direction)
                    pushInList({
                        x: ncell.x,
                        y: ncell.y,
                        color: colors[1],
                        connectionNeeds: [ [ DIRECTION_MAP[DIRECTION_MIROR[dndx]] ] ],
                        priority: 1 + (prevColor.filter(n => n.connected).length > 0 ? 0 : 1.5) + (nextColor.filter(n => n.connected).length > 0 ? 0 : 1.5),
                        explain: 'Fill up cell with good colors around'
                    })
                })
            }
        } else if( prevColor.length > 0 || nextColor.length > 0 ) {
            const hasEmpty = neighbors.filter(n => n.neuro === undefined)
            if (cell.neuro === undefined && hasEmpty.length > 0) {
                // Empty cell, at least one color around and one free space
                pushInList({
                    x: cell.x,
                    y: cell.y,
                    color: colors[1],
                    connectionNeeds: [ neighbors.filter(n => n.neuro === undefined).map(n => n.direction), (prevColor || nextColor).map(n => n.direction)],
                    priority: 2 + ((prevColor || nextColor).filter(n => n.connected).length > 0 ? 0 : 1.5),
                    explain: 'Empty cell, at least one color around and one free space',
                })            
            } else if (cell.neuro !== undefined && hasEmpty.length > 0) {
                // Not empty cell, at least one color around and one free space
                hasEmpty.forEach(ncell => {
                    const dndx = DIRECTION_MAP.indexOf(ncell.direction)
                    pushInList({
                        x: ncell.x,
                        y: ncell.y,
                        color: prevColor ? colors[2] : colors[1],
                        connectionNeeds: [ [ DIRECTION_MAP[DIRECTION_MIROR[dndx]] ] ],
                        priority: 1 + ((prevColor || nextColor).filter(n => n.connected).length > 0 ? 0 : 1.5),
                        explain: 'Not empty cell, at least one color around and one free space',
                    })            
                })
            }
        } else {
            const has2Empty = neighbors.filter(n => n.neuro === undefined).length >= 2;
            if (has2Empty && cell.neuro === undefined ) {
                // Empty cell, no colors around, and at least 2 empty cell
                colors.forEach(c => {
                    const dirs = neighbors.filter(n => n.neuro === undefined).map(n => n.direction)
                    list.push({
                        x: cell.x,
                        y: cell.y,
                        color: c,
                        connectionNeeds: [ dirs, dirs ],
                        priority: 3,
                        explain: 'Empty cell, no colors around, and at least 2 empty cell',
                    })
                })
            }
        }
    })

    list.sort((a,b) => a.priority - b.priority)
    return list;
}


/**
 * Search all existring pattern that validate a 3 color project 
 */
export function search3ColorsProjectMatch(board: Board, project: Project): ICell[][] {
    const colors = project.colors
    // Base on middle color
    const cells = board.cells.filter(c => c.neuro.color === colors[1] )

    const list:ICell[][] = []
    // Search for ready projects
    cells.forEach(cell => {
        const neighbors = board.neighborOf(cell.x, cell.y).filter(n => {
            const ndx = DIRECTION_MAP.indexOf(n.direction)
            return cell.neuro.connections[ndx]
        })

        const step1 = neighbors.find(n => n.neuro && n.neuro.color === colors[0] && n.connected)
        if (step1 !== undefined && step1.neuro !== undefined) {
            const step3 = neighbors.find(n => 
                    n.neuro 
                    && n.neuro.color === colors[2] 
                    && n.connected 
                    && n.neuro.id !== step1.neuro?.id
                )
            if(step3 && step3.neuro) {
                const obj: ICell[] = [
                    {
                        neuro: step1.neuro,
                        x: step1.x,
                        y: step1.y,
                    }, 
                    {
                        neuro: cell.neuro,
                        x: cell.x,
                        y: cell.y,
                    }, 
                    {
                        neuro: step3.neuro,
                        x: step3.x,
                        y: step3.y,
                    }
                ]
                list.push(obj)
            }
        }
    })

    return list
}