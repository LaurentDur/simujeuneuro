
import { drawBoard } from "./controllers/draw";
import { exportCurrentGame } from "./controllers/export";
import GameEngine from "./controllers/gameengine";


const game = new GameEngine(2)

Array.from({length: 10}).forEach(() => {
    game.phaseDrawProjects();
    game.phasePlaceNeuro();
    game.phaseCheckProjectsCompletion();
    console.log( exportCurrentGame(game) )
})