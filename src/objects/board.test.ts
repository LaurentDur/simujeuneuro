import { IDirections } from "../types/ITypes";
import Board from "./board";
import Neuro from "./neuro";

test('Test coordinate', () => {
    expect(Board.isAValidCellNumber(1.3, 5)).toBeFalsy()
    expect(Board.isAValidCellNumber(1, 2)).toBeFalsy()
    expect(Board.isAValidCellNumber(5, 6)).toBeFalsy()
    expect(Board.isAValidCellNumber(3, 3)).toBeTruthy()
    expect(Board.isAValidCellNumber(0, 0)).toBeTruthy()
    expect(Board.isAValidCellNumber(-3, 3)).toBeTruthy()
    expect(Board.isAValidCellNumber(8, -8)).toBeTruthy()
});


test('Add neuro', () => {

    const neuro = new Neuro({
        color: 'green',
        connections: [true,false,true,true,false,true]
    })

    const board = new Board()
    expect(board.placeNeuroAt(neuro, 0, 0)).toBeTruthy()
    
    expect(board.getNeuroAt(0, 0)?.id).toBe(neuro.id)

    expect(board.placeNeuroAt(neuro, 0, 0)).toBeFalsy()
});

test('Get neuro', () => {

    const neuro = new Neuro({
        color: 'green',
        connections: [true,false,true,true,false,true]
    })

    const board = new Board()
    expect(board.placeNeuroAt(neuro, 3, -3)).toBeTruthy()
    expect(board.findNeuro(neuro)?.x).toBe(3)
    expect(board.findNeuro(neuro)?.y).toBe(-3)

});

test('Remove neuro', () => {

    const neuro = new Neuro({
        color: 'green',
        connections: [true,false,true,true,false,true]
    })
    const board = new Board()
    expect(board.placeNeuroAt(neuro, 3, -3)).toBeTruthy()
    expect(board.findNeuro(neuro)).not.toBe(undefined)
    expect(board.removeNeuro(neuro)?.id).toBe(neuro.id)
    expect(board.findNeuro(neuro)).toBe(undefined)

});

test('Get neuro AT', () => {

    const neuro = new Neuro({
        color: 'green',
        connections: [true,false,true,true,false,true]
    })

    const board = new Board()
    expect(board.placeNeuroAt(neuro, 0, 0)).toBeTruthy()
    expect(board.getNeuroAt(0, 0)?.id).toBe(neuro.id)
    expect(board.getNeuroAt(1, -1)).toBe(undefined)

});

test('Remove neuro AT', () => {

    const neuro = new Neuro({
        color: 'green',
        connections: [true,false,true,true,false,true]
    })
    const board = new Board()
    expect(board.placeNeuroAt(neuro, 0, 0)).toBeTruthy()
    expect(board.getNeuroAt(0, 0)?.id).toBe(neuro.id)
    expect(board.removeNeuroAt(0, 0)?.id).toBe(neuro.id)
    expect(board.getNeuroAt(0, 0)).toBe(undefined)

});

test('Same Diag', () => {

    const neuroA = new Neuro({
        color: 'green',
        connections: [true,false,true,true,false,true]
    })
    const neuroB = new Neuro({
        color: 'green',
        connections: [true,false,true,true,false,true]
    })
    const neuroC = new Neuro({
        color: 'green',
        connections: [true,false,true,true,false,true]
    })

    const board = new Board()
    expect(board.placeNeuroAt(neuroA, 0, 0)).toBeTruthy()
    expect(board.placeNeuroAt(neuroB, 1, 1)).toBeTruthy()
    expect(board.placeNeuroAt(neuroC, 2, 2)).toBeTruthy()

    expect(board.areAligned([neuroA, neuroB, neuroC])).toBeTruthy()

});
test('Same Line', () => {

    const neuroA = new Neuro({
        color: 'green',
        connections: [true,false,true,true,false,true]
    })
    const neuroB = new Neuro({
        color: 'green',
        connections: [true,false,true,true,false,true]
    })
    const neuroC = new Neuro({
        color: 'green',
        connections: [true,false,true,true,false,true]
    })

    const board = new Board()
    expect(board.placeNeuroAt(neuroA, 0, 0)).toBeTruthy()
    expect(board.placeNeuroAt(neuroB, 0, 2)).toBeTruthy()
    expect(board.placeNeuroAt(neuroC, 0, 6)).toBeTruthy()

    expect(board.areAligned([neuroA, neuroB, neuroC])).toBeTruthy()

});
test('Same Col', () => {

    const neuroA = new Neuro({
        color: 'green',
        connections: [true,false,true,true,false,true]
    })
    const neuroB = new Neuro({
        color: 'green',
        connections: [true,false,true,true,false,true]
    })
    const neuroC = new Neuro({
        color: 'green',
        connections: [true,false,true,true,false,true]
    })

    const board = new Board()
    expect(board.placeNeuroAt(neuroA, 9, 3)).toBeTruthy()
    expect(board.placeNeuroAt(neuroB, 3, 3)).toBeTruthy()
    expect(board.placeNeuroAt(neuroC, 1, 3)).toBeTruthy()

    expect(board.areAligned([neuroA, neuroB, neuroC])).toBeTruthy()

});
test('Same Not aligned', () => {

    const neuroA = new Neuro({
        color: 'green',
        connections: [true,false,true,true,false,true]
    })
    const neuroB = new Neuro({
        color: 'green',
        connections: [true,false,true,true,false,true]
    })
    const neuroC = new Neuro({
        color: 'green',
        connections: [true,false,true,true,false,true]
    })

    const board = new Board()
    expect(board.placeNeuroAt(neuroA, 9, 3)).toBeTruthy()
    expect(board.placeNeuroAt(neuroB, 0, 0)).toBeTruthy()
    expect(board.placeNeuroAt(neuroC, 1, 3)).toBeTruthy()

    expect(board.areAligned([neuroA, neuroB, neuroC])).toBeFalsy()

});

test('Place according to All', () => {

    const neuroA = new Neuro({
        color: 'green',
        connections: [true,false,true,true,false,true]
    })
    const neuroB = new Neuro({
        color: 'green',
        connections: [true,false,true,true,false,true]
    })

    const board = new Board()
    expect(board.placeNeuroAt(neuroA, 0, 0)).toBeTruthy()

    const test: {d: IDirections, x:number, y: number}[] = [
        { d: "B", x: 0, y: -2 },
        { d: "BL", x: -1, y: -1 },
        { d: "BR", x: 1, y: -1 },
        { d: "L", x: -2, y: 0 },
        { d: "R", x: 2, y: 0 },
        { d: "T", x: 0, y: 2 },
        { d: "TL", x: -1, y: 1 },
        { d: "TR", x: 1, y: 1 },
    ]

    test.forEach(t => {
        const b = board.placeNeuroNear(neuroA, neuroB, t.d)
        expect(b.x).toBe(t.x)
        expect(b.y).toBe(t.y)
    })




});

test('Place according to', () => {

    const neuroA = new Neuro({
        color: 'green',
        connections: [true,false,true,true,false,true]
    })
    const neuroB = new Neuro({
        color: 'green',
        connections: [true,false,true,true,false,true]
    })
    const neuroC = new Neuro({
        color: 'green',
        connections: [true,false,true,true,false,true]
    })

    const board = new Board()
    expect(board.placeNeuroAt(neuroA, 3, 3)).toBeTruthy()

    const b = board.placeNeuroNear(neuroA, neuroB, 'BL')
    expect(b.x).toBe(2)
    expect(b.y).toBe(2)

    const c = board.placeNeuroNear(neuroA, neuroC, 'TR')
    expect(c.x).toBe(4)
    expect(c.y).toBe(4)

    expect(board.areAligned([neuroA, neuroB, neuroC])).toBeTruthy()

});


test('Place on existing', () => {

    const neuroA = new Neuro({
        color: 'green',
        connections: [true,false,true,true,false,true]
    })
    const neuroB = new Neuro({
        color: 'green',
        connections: [true,false,true,true,false,true]
    })
    const neuroC = new Neuro({
        color: 'green',
        connections: [true,false,true,true,false,true]
    })

    const board = new Board()
    expect(board.placeNeuroAt(neuroA, 3, 3)).toBeTruthy()
    board.placeNeuroNear(neuroA, neuroB, 'BL')
    const c = () => {
        board.placeNeuroNear(neuroA, neuroC, 'BL')
    }

    expect(c).toThrow(Error);

});


test('Test Overclocked Paths', () => {

    const neuroA = new Neuro({
        color: 'green',
        connections: [true,true,true,true,true,true]
    })
    const neuroB = new Neuro({
        color: 'red',
        connections: [false,true,true,true,true,true]
    })
    const neuroC = new Neuro({
        color: 'yellow',
        connections: [true,true,true,true,true,true]
    })
    const neuroE = new Neuro({
        color: 'black',
        connections: [true,true,true,true,true,true]
    })

    const board = new Board()
    board.placeNeuroAt(neuroA, 17, 17)
    board.placeNeuroNear(neuroA, neuroB, 'T')
    board.placeNeuroNear(neuroB, neuroC, 'TR')
    board.placeNeuroNear(neuroC, neuroE, 'TR')

    expect(board.distanceBetween(neuroA, neuroC)).toBe(2)
    expect(board.distanceBetween(neuroA, neuroB)).toBe(1)
    expect(board.distanceBetween(neuroA, neuroE)).toBe(3)
    expect(board.distanceBetween(neuroE, neuroC)).toBe(1)
    expect(board.distanceBetween(neuroB, neuroC)).toBe(1)
});


test('Test Paths', () => {

    const neuroA = new Neuro({
        color: 'green',
        connections: [true,false,false,false,false,false]
    })
    const neuroB = new Neuro({
        color: 'red',
        connections: [false,true,false,false,false,false]
    })
    const neuroC = new Neuro({
        color: 'yellow',
        connections: [false,false,false,false,false,true]
    })
    const neuroE = new Neuro({
        color: 'black',
        connections: [false,false,true,false,false,false]
    })

    const board = new Board()
    board.placeNeuroAt(neuroA, 17, 17)
    board.placeNeuroNear(neuroA, neuroB, 'T')
    board.placeNeuroNear(neuroB, neuroC, 'TR')
    board.placeNeuroNear(neuroC, neuroE, 'TL')

    expect(board.distanceBetween(neuroA, neuroC)).toBe(2)
    expect(board.distanceBetween(neuroA, neuroB)).toBe(1)
    expect(board.distanceBetween(neuroA, neuroE)).toBe(3)
    expect(board.distanceBetween(neuroE, neuroC)).toBe(1)
    expect(board.distanceBetween(neuroB, neuroC)).toBe(1)
    expect(board.distanceBetween(neuroB, neuroE)).toBe(2)
});