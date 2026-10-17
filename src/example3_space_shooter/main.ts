import {Color, DisplayMode, Engine, KeyEvent, Keys} from "../../src/engine";
import {Config} from './config';
import {loader, Sounds} from './resources';
import {Game} from './game';

async function waitForFontLoad(font: string, timeout = 2_000, interval = 100) {
    return new Promise((resolve, reject) => {
        // repeatedly poll check
        const poller = setInterval(async () => {
            try {
                await document.fonts.load(font);
            } catch (err) {
                reject(err);
            }
            if (document.fonts.check(font)) {
                clearInterval(poller);
                resolve(true);
            }
        }, interval);
        setTimeout(() => clearInterval(poller), timeout);
    });
}

const engine = new Engine({
    backgroundColor: Color.Black,
    pixelRatio: 2,
    width: 1000,
    height: 800,
    displayMode: DisplayMode.FitScreen,
    antialiasing: false
});
engine.debug.entity.showName = true;
engine.backgroundColor = Color.Black;

// Setup game scene
engine.add('game', new Game());
engine.goToScene('game');

// Game events to handle
engine.on('hidden', () => {
    console.log('pause');
    engine.stop();
});
engine.on('visible', () => {
    console.log('start');
    engine.start();
});

engine.input.keyboard.on('press', (evt: KeyEvent) => {
    if (evt.key === Keys.D) {
        engine.toggleDebug();
    }
});

waitForFontLoad("normal 30px Open Sans").then(() => {
    engine.start(loader).then(() => {
        Sounds.laserSound.volume = Config.soundVolume;
        Sounds.explodeSound.volume = Config.soundVolume;
        Sounds.enemyFireSound.volume = Config.soundVolume;
        Sounds.powerUp.volume = Config.soundVolume;
        Sounds.rocketSound.volume = Config.soundVolume;

        console.log("Game Resources Loaded");
    });
})