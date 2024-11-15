import { randomUUID } from 'node:crypto'
import fs from 'fs'
import GameEngine from './gameengine';
import { drawBoard } from './draw';

let COUNTER = 0;
const uuid = randomUUID()

export function exportCurrentGame(game: GameEngine) {
    const raw = [(new Date()).getMonth(),(new Date()).getDay(),uuid,''].join('-')
    const fileName = 'exports/' + raw + (++COUNTER) + '.html';

    const file = fs.openSync(fileName, 'w')

    fs.writeSync(file, `<a href='${raw + (COUNTER + 1) + '.html'}'>Next</a>`)

    fs.writeSync(file, `<h1>Players</h1>`)
    game.players.forEach(player => {
        fs.writeSync(file, `<br/>Player ${player.id} has completed ${player.nbCompleted} project${player.nbCompleted > 1 ? 's' : ''}`)

        fs.writeSync(file, `<ul>`)
        fs.writeSync(file, `<li>Hand: ${player.getHand().map(p => p.colors.map(color).join('')).join(' --- ')}</li>`)
        fs.writeSync(file, `<li>Completed: ${player.completed.map(p => p.colors.map(color).join('')).join(' --- ')}</li>`)
        fs.writeSync(file, `</ul>`)
    })

    
    fs.writeSync(file, `<h1>Board</h1>`)
    fs.writeSync(file, drawBoard(game.board))

    fs.writeSync(file, `<h1>Log</h1>`)
    fs.writeSync(file, Array.from(game.log).reverse().join('<br/>'))
    
    fs.writeSync(file, `<pre style='display:none'>${JSON.stringify(game.board.cells, null, 4)}</pre>`)

    return fileName
}

function color(color: string) {
    return `<span style='background:${color};padding:4px;line-height:32px'>${color}</span>`
}