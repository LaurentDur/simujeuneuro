
export type IConnections = [boolean,boolean,boolean,boolean,boolean,boolean]

export type IColor = 'blue' | 'red' | 'yellow' | 'black' | 'pink' | 'green';

export type IRoration = 0 | 1 | 2 | 3 | 4 | 5;

export type IDirections = 'L' | 'TL' | 'T' | 'TR' | 'R' | 'BR' | 'B' | 'BL'

export const DIRECTION_MAP: IDirections[] = ['T','TR','BR','B','BL','TL']
export const DIRECTION_MIROR: number[] = [3, 4, 5, 0, 1, 2] //['B','BL','TL','T','TR','BR']