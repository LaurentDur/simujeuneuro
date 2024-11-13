
/**
 * Pick and remove from Array
 * @param list 
 * @returns 
 */
export function randomPick<T>(list: T[]): T {
    if( list.length === 0 ) throw new Error('List is empty');

    const n = Math.floor(Math.random() * list.length);
    return list.splice(n, 1)[0];
}

/**
 * Pick, DO NOT remove
 * @param list 
 */
export function selectRandom<T>(list: T[]): T {
    if( list.length === 0 ) throw new Error('List is empty');

    const n = Math.floor(Math.random() * list.length);
    return list[n];
}

/**
 * Shuffle an array
 * @param list 
 */
export function shuffleArray<T>(list: T[]): void {
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
}


/**
 * Rotate an array a step number of time
 * @param list 
 * @param step 
 */
export function rotateArray<T>(list: T[], step: number): void {
    for( let i = 0; i < step; i++ ) {
        list.unshift( list.pop() as T )
    }
}