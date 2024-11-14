
import GameEngine from "./controllers/gameengine";


const game = new GameEngine(4)

game.phaseDrawProjects();
game.phasePlaceNeuro();
game.phasePlaceNeuro();

console.log(game.board)

const cls = game.board.cells
const d = game.board.distanceBetween(cls[0].neuro, cls[1].neuro)
const p = game.board.getPathBetween(cls[0].neuro, cls[1].neuro)

console.log(d, p);

console.log(cls.map(n => n.neuro.color))