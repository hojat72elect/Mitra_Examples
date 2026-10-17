import {Color, DisplayMode, Engine, Loader, vec} from  "../../src/engine";
import {Resources} from './Resources.ts';
import {Level} from './Level.ts';
import {initializeMuteButton} from './Ui.ts';

/**
 * Positions the mute button in the bottom left of the screen.
 */
const positionUI = (game: Engine) => {
    const ui = document.getElementsByClassName("ui")[0] as HTMLElement;
    if (ui) {
        const topLeft = game.screen.screenToPageCoordinates(vec(10, 500 - 40));
        ui.style.visibility = 'visible';
        ui.style.left = topLeft.x + 'px';
        ui.style.top = topLeft.y + 'px';
    }
}

const flappyBirdGame = new Engine({
    width: 400,
    height: 500,
    backgroundColor: Color.fromHex("#54C0CA"),
    pixelArt: true,
    pixelRatio: 2,
    displayMode: DisplayMode.FitScreen,
    scenes: {Level}
});

// Preloads all assets. We still need to import required assets.
const loader = new Loader(Object.values(Resources));

flappyBirdGame.start(loader).then(() => {
    flappyBirdGame.goToScene('Level');
    positionUI(flappyBirdGame);
    initializeMuteButton();
});

flappyBirdGame.screen.events.on('resize', () => positionUI(flappyBirdGame));
