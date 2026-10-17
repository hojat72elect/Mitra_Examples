import {
    Actor,
    Animation,
    AnimationStrategy,
    CollisionGroup,
    CollisionType,
    Engine,
    PreCollisionEvent,
    Util,
    Vector
} from "../../../src/engine";
import {Config} from "../config";
import {gameSheet} from "../resources";
import {Baddie} from "./Baddie";

export class Bullet extends Actor {
    constructor(x: number, y: number, dx: number, dy: number, collisionGroup: CollisionGroup) {
        super({
            pos: new Vector(x, y),
            vel: new Vector(dx, dy),
            width: Config.bulletSize,
            height: Config.bulletSize,
        });
        this.body.collisionType = CollisionType.Passive;
        this.body.group = collisionGroup;
    }

    onInitialize(_engine: Engine) {
        this.on('precollision', (evt) => this.onPreCollision(evt));
        // Clean up on exit viewport
        this.on('exitviewport', () => this.killAndRemoveFromBullets());

        const anim = Animation.fromSpriteSheet(gameSheet, [3, 4, 5, 6, 7, 8, 7, 6, 5, 4], 100, AnimationStrategy.Loop);
        anim.scale = new Vector(2, 2);
        this.graphics.use(anim);
    }

    private onPreCollision(evt: PreCollisionEvent) {
        if (!(evt.other instanceof Bullet)) {
            this.killAndRemoveFromBullets();
        }
    }

    private killAndRemoveFromBullets() {
        this.kill();
        Util.removeItemFromArray(this, Baddie.Bullets);
    }
}