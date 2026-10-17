import {Color, CoordPlane, Engine, FontUnit, Label, Random, Scene, Timer, vec, Vector} from "../../src/engine";
import {Ship} from './actors/ship';
import {HealthBar} from './actors/HealthBar';
import {stats} from './stats';
import {Baddie} from './actors/Baddie';
import {Config} from './config';
import {animManager} from './actors/AnimationManager';

export class Game extends Scene {
    random = new Random(1337); // seeded random

    constructor() {
        super();
    }

    onInitialize(engine: Engine) {
        engine.add(animManager);

        const ship = new Ship(engine.halfDrawWidth, 800, 80, 80);
        engine.add(ship);

        const healthBar = new HealthBar();
        engine.add(healthBar);

        const scoreLabel = new Label({
            text: "Score: " + stats.score,
            pos: vec(80, 50)
        });
        scoreLabel.font.quality = 4;
        scoreLabel.font.size = 30;
        scoreLabel.font.unit = FontUnit.Px;
        scoreLabel.font.family = "Open Sans";
        scoreLabel.transform.coordPlane = CoordPlane.Screen;
        scoreLabel.color = Color.Azure;
        scoreLabel.on('preupdate', (_event) => {
            scoreLabel.text = "Score: " + stats.score;
        });
        engine.add(scoreLabel);

        const gameOverLabel = new Label({
            text: "Game Over",
            pos: vec(engine.halfDrawWidth - 250, engine.halfDrawHeight)
        });
        gameOverLabel.font.quality = 4;
        gameOverLabel.font.size = 60;
        gameOverLabel.color = Color.Green.clone();
        gameOverLabel.scale = new Vector(2, 2);
        gameOverLabel.actions.repeatForever(ctx => ctx.blink(1000, 1000, 400));


        let baddieTimer = new Timer({
            action: () => {
                var bad = new Baddie(this.random.floating(this.camera.viewport.left, this.camera.viewport.right), -100, 80, 80);
                engine.add(bad);
            },
            interval: Config.spawnTime,
            repeats: true,
            numberOfRepeats: -1
        });

        engine.addTimer(baddieTimer);
        baddieTimer.start();

        engine.on('preupdate', () => {
            if (stats.gameOver) {
                engine.add(gameOverLabel);
            }
        });

    }

}