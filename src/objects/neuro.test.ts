import { IConnections } from "../types/ITypes";
import Neuro from "./neuro";


test('Test Neuro ID', () => {
    const c: IConnections = [false, true, true, false, true, false]
    const neuroA = new Neuro({
        connections: c,
        color: 'pink'
    });
    const neuroB = new Neuro({
        connections: c,
        color: 'pink'
    });
    expect(neuroA.id).not.toBe(neuroB.id)
});

test('Create new neuro A', () => {
    const c: IConnections = [false, true, true, false, true, false]
    const neuro = new Neuro({
        connections: c,
        color: 'pink'
    });
    c.forEach((n,i) => {
        expect(neuro.connections[i]).toBe(n);
    })

    expect(neuro.color).toBe('pink')
});


test('Create new neuro B', () => {
    const c: IConnections = [false, false, true, false, true, true]
    const neuro = new Neuro({
        connections: c,
        color: 'red'
    });
    c.forEach((n,i) => {
        expect(neuro.connections[i]).toBe(n);
    })

    expect(neuro.color).toBe('red')
});



test('Overclock neuro', () => {
    const neuro = new Neuro({
        connections: [false, true, true, false, true, false],
        color: 'pink'
    });
    neuro.overclocked = true
    neuro.connections.forEach((n) => {
        expect(n).toBeTruthy();
    })
});

test('Overclock and rotate neuro', () => {
    const neuro = new Neuro({
        connections: [false, true, true, false, true, false],
        color: 'yellow'
    });
    neuro.rotation = 3
    neuro.overclocked = true
    neuro.connections.forEach((n) => {
        expect(n).toBeTruthy();
    })
});


test('Rotate neuro 1', () => {
    const neuro = new Neuro({
        connections: [false, true, true, false, true, false],
        color: 'pink'
    });
    neuro.rotation = 1
    expect(neuro.connections.join(',')).toBe('false,false,true,true,false,true')
});

test('Rotate neuro 5', () => {
    const neuro = new Neuro({
        connections: [false, true, true, false, true, false],
        color: 'pink'
    });
    neuro.rotation = 5
    expect(neuro.connections.join(',')).toBe('true,true,false,true,false,false')
});