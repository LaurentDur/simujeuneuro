import Board from "../objects/board";
import Neuro from "../objects/neuro";

export function drawBoard(board: Board, size: number = 20) {
    const cells = board.cells

    const minX = cells.reduce((prev, curr) => curr.x < prev ? curr.x : prev, 0)
    const minY = cells.reduce((prev, curr) => curr.y < prev ? curr.y : prev, 0)
    const offset = -1 * Math.min(minX, minY) + 3

    return `<?xml version="1.0"?>
<svg width="640" height="480" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
    <g class="layer">
    ${cells.map(cell => {
        return drawCell(cell.neuro, cell.x, cell.y, offset, size)
    }).join('')}
    </g>
</svg>`

}

function drawCell(neuro: Neuro, x: number, y: number, offset: number, size: number) {
    //points="402.3472595214844,219.5 354.9236145019531,301.64012145996094 260.0763702392578,301.64012145996094 212.6527557373047,219.5 260.0763702392578,137.35987854003906 354.9236145019531,137.35987854003906 402.3472595214844,219.5 " 
    const points = [[0,2],[1,1],[1,-1],[0,-2],[-1,-1],[-1,1]].map(n => n.map(n => n * size))
    const corners = [[-0.3,0.95],[0.3,0.95],[0.6,0],[0.3,-0.95],[-0.3,-0.95],[-0.6,0]].map(n => n.map(n => n * size))
    const center = [x+offset, y+offset].map(n => n * size)
    let svg = `<polygon 
        edge="1" 
        cx="${center[0]}" cy="${center[1]}"
        fill="${neuro.color}" id="${neuro.id}" 
        orient="x" 
        points="${corners.map(p => {
            const nextCenter = [(p[0]+x) , (p[1]+y)]
            const psx = [(center[0]) + (nextCenter[0]-(x)), (center[1]) + (nextCenter[1]-(y))]
            return psx.join(',')
        }).join(' ')}" 
        shape="regularPoly" sides="6" 
        stroke="#000000" stroke-width="0" strokeWidth="0" strokecolor="#000000"/>`    

    neuro.connections.forEach((c,i) => {
        if (c === true) {
            const p = points[i]
            const nextCenter = [(p[0]+x) , (p[1]+y)]
            const psx = [(center[0]) + (nextCenter[0]-(x))/2, (center[1]) + (nextCenter[1]-(y))/2]
            svg += `<line x1="${center[0]}" y1="${center[1]}" x2="${psx[0]}" y2="${psx[1]}" 
                stroke="#000000" stroke-width="0.5" strokeWidth="0.5" strokecolor="#000000" />`
        }
    })

    return svg
}