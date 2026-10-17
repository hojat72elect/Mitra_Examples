import {
    Actor,
    Animation,
    AnimationStrategy,
    clamp,
    Collider,
    Color,
    Engine,
    Keys,
    Sprite,
    SpriteSheet,
    vec
} from  "../../src/engine";
import {Resources} from "./Resources.ts";
import {GameConfig} from "./GameConfig.ts";
import {Level} from "./Level.ts";
import {Pipe} from "./Pipe.ts";
import {Ground} from "./Ground.ts";

export class Bird extends Actor {
    playing = false;
    jumping = false;
    startSprite!: Sprite;
    upAnimation!: Animation;
    downAnimation!: Animation;
    level: Level

    constructor(level: Level) {
        super({
            pos: GameConfig.BirdStartPos,
            radius: 8,
            color: Color.Yellow
        });
        this.level = level;
    }

    override onInitialize(): void {
        const spriteSheet = SpriteSheet.fromImageSource({
            image: Resources.BirdImage,
            grid: {
                rows: 1,
                columns: 4,
                spriteWidth: 32,
                spriteHeight: 32,
            }
        });

        this.startSprite = spriteSheet.getSprite(1, 0);
        this.upAnimation = Animation.fromSpriteSheet(spriteSheet, [2, 1, 0], 150, AnimationStrategy.Freeze);
        this.downAnimation = Animation.fromSpriteSheet(spriteSheet, [0, 1, 2], 150, AnimationStrategy.Freeze);

        // Register
        this.graphics.add('down', this.downAnimation);
        this.graphics.add('up', this.upAnimation);
        this.graphics.add('start', this.startSprite);

        this.graphics.use('start');

        this.on('exitviewport', () => {
            this.level.triggerGameOver();
        });
    }

    private isInputActive(engine: Engine) {
        return (engine.input.keyboard.isHeld(Keys.Space) ||
            engine.input.pointers.isDown(0))
    }

    override onPostUpdate(engine: Engine): void {
        if (!this.playing) return;

        // if the space bar or the first pointer was down
        if (!this.jumping && this.isInputActive(engine)) {
            this.vel.y += GameConfig.BirdJumpVelocity;
            this.jumping = true;
            this.graphics.use('up');
            // rewind
            this.upAnimation.reset();
            this.downAnimation.reset();
            // play sound effect
            Resources.FlapSound.play();
        }

        if (!this.isInputActive(engine)) {
            this.jumping = false;
        }

        this.vel.y = clamp(this.vel.y, GameConfig.BirdMinVelocity, GameConfig.BirdMaxVelocity);

        // The "speed" the bird will move relative to pipes
        this.rotation = vec(GameConfig.PipeSpeed, this.vel.y).toAngle();

        if (this.vel.y > 0) {
            this.graphics.use('down');
        }
    }

    start() {
        this.playing = true;
        this.pos = GameConfig.BirdStartPos; // starting position
        this.acc = vec(0, GameConfig.BirdAcceleration); // pixels per second per second
    }

    reset() {
        this.pos = GameConfig.BirdStartPos; // starting position
        this.stop();
    }

    stop() {
        this.playing = false;
        this.vel = vec(0, 0);
        this.acc = vec(0, 0);
    }

    override onCollisionStart(_self: Collider, other: Collider): void {
        if (other.owner instanceof Pipe ||
            other.owner instanceof Ground
        ) {
            this.level.triggerGameOver();
        }
    }
}