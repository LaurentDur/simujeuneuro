import { IColor, IConnections } from "../types/ITypes"

export const GAME_PRESET: {
    colors: IColor[],
    neuroTypes: {
        type: IConnections,
        weight: number,
    }[],
} = {
    colors: ['blue', 'green', 'purple', 'red', 'yellow'],
    neuroTypes: [
        { 
            type: [true, true, true, false, false, false],
            weight: 4,
        },       
        { 
            type: [true, true, false, false, true, false],
            weight: 4,
        },       
        { 
        
            type: [true, true, false, true, false, false],
            weight: 4,
        },       
        { 
        
            type: [true, false, true, false, true, false],
            weight: 4,
        },    
    ]
}