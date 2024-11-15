
import { drawBoard } from "./controllers/draw";
import { exportCurrentGame } from "./controllers/export";
import GameEngine from "./controllers/gameengine";


const game = new GameEngine(4)

Array.from({length: 4}).forEach(() => {
    game.phaseDrawProjects();
    game.phasePlaceNeuro();
    game.phaseCheckProjectsCompletion();
    console.log( exportCurrentGame(game) )
})