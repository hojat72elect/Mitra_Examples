import {
    Actor,
    Animation,
    AnimationStrategy,
    CollisionGroupManager,
    CollisionType,
    Engine,
    KeyEvent,
    Keys,
    PointerEvent,
    PreCollisionEvent,
    range,
    Util,
    Vector
} from "../../../src/engine";
import {explosionSpriteSheet, gameSheet, Sounds} from "../resources";
import {Config} from "../config";
import {Bullet} from "./bullet";
import {Baddie} from "./Baddie";
import {animManager} from "./AnimationManager";
import {stats} from "../stats";

type FireFunction = (engine: Engine) => void;

const throttle = function (this: any, func: FireFunction, _throttle: number): FireFunction {
    let lastTime = Date.now();
    let throttle = _throttle;
    return (engine: Engine) => {
        let currentTime = Date.now();
        if (currentTime - lastTime > throttle) {
            let val = func.apply(this, [engine]);
            lastTime = currentTime;
            return val;
        }
    }
}

export class Ship extends Actor {
    static group = CollisionGroupManager.create('player');
    private flipBarrel = false;
    private throttleFire?: FireFunction;
    private explode?: Animation;

    constructor(x: number, y: number, width: number, height: number) {
        super({
            pos: new Vector(x, y),
            width: width,
            height: height,
        });

        this.body.collisionType = CollisionType.Passive;
        // Player group does not collide with itself
        this.body.group = Ship.group;
    }

    onInitialize(engine: Engine) {
        this.throttleFire = throttle(this.fire, Config.playerFireThrottle);
        this.on('precollision', (evt) => this.onPreCollision(evt));

        // Keyboard
        engine.input.keyboard.on('hold', (evt) => this.handleKeyEvent(engine, evt));
        engine.input.keyboard.on('release', (evt: KeyEvent) => {
            if (evt.key !== Keys.Space) {
                this.vel = Vector.Zero.clone()
            }
        });

        // Pointer
        engine.input.pointers.primary.on('down', (evt) => this.handlePointerEvent(engine, evt));
        engine.input.pointers.primary.on('up', () => this.vel = Vector.Zero.clone());

        // Get animation
        const anim = Animation.fromSpriteSheet(gameSheet, [0, 1, 2], 100, AnimationStrategy.Loop);
        anim.scale = new Vector(4, 4);
        this.graphics.use(anim);

        this.explode = Animation.fromSpriteSheet(explosionSpriteSheet, range(0, explosionSpriteSheet.sprites.length - 1), 40, AnimationStrategy.End);
        this.explode.scale = new Vector(3, 3);
    }

    onPreCollision(event: PreCollisionEvent) {
        if (event.other instanceof Baddie || Util.contains(Baddie.Bullets, event.other)) {
            Sounds.hitSound.play();
            this.actions.blink(300, 300, 3);
            stats.hp -= Config.enemyDamage;
            if (stats.hp <= 0) {
                stats.gameOver = true;
                this.kill();
                this.stopRegisteringFireThrottleEvent();
            }
        }
    }

    private stopRegisteringFireThrottleEvent = () => {
        this.throttleFire = undefined;
    }

    onPostUpdate(engine: Engine, _delta: number) {
        if (stats.hp <= 0 && this.explode) {
            // update game to display game over
            // gameOver = true;
            animManager.play(this.explode, this.pos);
            Sounds.explodeSound.play();
            this.kill();
        }

        // Keep player in the viewport
        if (this.pos.x < 0) this.pos.x = 0;
        if (this.pos.y < 0) this.pos.y = 0;
        if (this.pos.x > engine.drawWidth - this.width) this.pos.x = (engine.drawWidth - this.width);
        if (this.pos.y > engine.drawHeight - this.height) this.pos.y = (engine.drawHeight - this.height);
    }

    private fire = (engine: Engine) => {
        let bullet = new Bullet(this.pos.x + (this.flipBarrel ? -40 : 40), this.pos.y - 20, 0, Config.playerBulletVelocity, Ship.group);
        this.flipBarrel = !this.flipBarrel;
        Sounds.laserSound.play();
        engine.add(bullet);
    }

    handlePointerEvent = (engine: Engine, evt: PointerEvent) => {
        let dir = evt.worldPos.sub(this.pos);
        let distance = dir.magnitude;
        if (distance > 50) {
            this.vel = dir.scale(Config.playerSpeed / distance);
        } else {
            this.throttleFire ? this.throttleFire(engine) : null;
        }
    }

    handleKeyEvent = (engine: Engine, evt: KeyEvent) => {
        let dir = Vector.Zero.clone();

        if (evt.key === Keys.Space) {
            this.throttleFire ? this.throttleFire(engine) : null;
            if (this.vel.x !== 0 || this.vel.y !== 0) {
                dir = this.vel.normalize();
            }
        }
        // Some keys do the same thing
        if (evt.key === Keys.Up ||
            evt.key === Keys.W) {
            dir.y += -1;
        }

        if (evt.key === Keys.Left ||
            evt.key === Keys.A) {
            dir.x += -1;
        }

        if (evt.key === Keys.Right ||
            evt.key === Keys.D) {
            dir.x += 1;
        }

        if (evt.key === Keys.Down ||
            evt.key === Keys.S) {
            dir.y += 1;
        }

        if (dir.x !== 0 || dir.y !== 0) {
            this.vel = dir.normalize().scale(Config.playerSpeed);
        }
    }
}
