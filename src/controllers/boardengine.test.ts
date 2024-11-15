import Board from "../objects/board"
import Neuro from "../objects/neuro"
import Project from "../objects/project"
import { getRotationCandidates, listProjectNeuroCandidates, search3ColorsProjectMatch } from "./boardengine"
import { drawBoard } from "./draw"
import { exportCurrentGame } from "./export"
import GameEngine from "./gameengine"


test('getRotationCandidates', () => {

    const neuro = new Neuro({
        connections: [false, true, true, false, true, false],
        color: 'blue'
    })
    expect(getRotationCandidates(neuro, 'B').join(',')).toBe('2,1,5')
    
    neuro.overclocked = true
    expect(getRotationCandidates(neuro, 'BL').join(',')).toBe('4,3,2,1,0,5')
})




test('listProjectNeuroCandidates', () => {

    const board = new Board()
    const neuroB = new Neuro({
        connections: [true, true, false, true, true, true],
        color: 'blue'
    })
    const neuroG = new Neuro({
        connections: [true, false, true, true, false, false],
        color: 'green'
    })
    const neuroR = new Neuro({
        connections: [true, true, true, true, true, true],
        color: 'red'
    })
    board.placeNeuroAt(neuroB, 0, 0)
    board.placeNeuroNear(neuroB, neuroG, 'T')
    board.placeNeuroNear(neuroB, neuroR, 'BL')
    const project = new Project('green','purple','blue')

    const candidates = listProjectNeuroCandidates(board, project)

    expect(candidates.filter(n => n.priority === 1).length).toBe(1)
    expect(candidates.length).toBeGreaterThan(1)
    const top = candidates.find(n => n.priority === 1)
    expect(top).not.toBe(undefined)
    if (top) {
        expect(top.color).toBe('purple')
        expect(top.x).toBe(1)
        expect(top.y).toBe(1)
        expect(top.connectionNeeds[0][0]).toBe('TL')
        expect(top.connectionNeeds[1][0]).toBe('BL')
    }

    // console.log("candidates", candidates.map(n => {
    //     return {
    //         ...n,
    //         connectionNeeds: n.connectionNeeds.map(k => k.join(','))
    //     }
    // }))
    // console.log(drawBoard(board))
})


test('search3ColorsProjectMatch', () => {

    const game = new GameEngine(1)
    const board = game.board
    const neuroB = new Neuro({
        connections: [false, false, true, false, false, true],
        color: 'blue'
    })
    neuroB.overclocked = true
    const neuroG = new Neuro({
        connections: [false, false, false, false, false, true],
        color: 'green'
    })
    const neuro0 = new Neuro({
        connections: [false, false, false, false, false, false],
        color: 'blue'
    })
    neuroG.overclocked = true
    board.placeNeuroAt(neuroB, 0, 0)
    board.placeNeuroNear(neuroB, neuro0, 'T')
    board.placeNeuroNear(neuroB, neuroG, 'BR')
    const project = new Project('green','blue','red')
    expect(search3ColorsProjectMatch(board, project).length).toBe(0)
    
    // Complete project
    const neuroR = new Neuro({
        connections: [false, false, true, false, false, false],
        color: 'red'
    })
    neuroR.overclocked = true
    board.placeNeuroNear(neuroB, neuroR, 'TL')
exportCurrentGame(game);
    const opt = search3ColorsProjectMatch(board, project)
    expect(opt.length).toBe(1)
    expect(opt[0][0].neuro.color).toBe('green')
    expect(opt[0][1].neuro.color).toBe('blue')
    expect(opt[0][2].neuro.color).toBe('red')
    
    neuroB.overclocked = false
    neuroG.overclocked = false
    neuroR.overclocked = false
    neuroB.rotation = 1
exportCurrentGame(game);
    const opt2 = search3ColorsProjectMatch(board, project)
    expect(opt2.length).toBe(0)
    

    neuroB.rotation = 0
exportCurrentGame(game);
    const opt3 = search3ColorsProjectMatch(board, project)
    expect(opt3.length).toBe(1)
    
})
