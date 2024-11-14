/**
 * This file provides function to analyse the board and propose 
 * options.
 */

import Board, { ICell } from "../objects/board";
import Neuro from "../objects/neuro";
import { DIRECTION_MAP, DIRECTION_MIROR, IDirections, IRoration } from "../types/ITypes";

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