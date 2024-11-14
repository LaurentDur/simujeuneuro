import Neuro from "../objects/neuro"
import { getRotationCandidates } from "./boardengine"


test('getRotationCandidates', () => {

    const neuro = new Neuro({
        connections: [false, true, true, false, true, false],
        color: 'blue'
    })
    expect(getRotationCandidates(neuro, 'B').join(',')).toBe('2,1,5')
    
    neuro.overclocked = true
    expect(getRotationCandidates(neuro, 'BL').join(',')).toBe('4,3,2,1,0,5')
})