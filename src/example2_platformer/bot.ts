import {
    Actor,
    Animation,
    CollisionGroupManager,
    CollisionType,
    Engine,
    Keys,
    PostCollisionEvent,
    Shape,
    Side,
    vec,
    Vector
} from "../../src/engine";
import {botSpriteSheet, Resources} from './resources';
import {Baddie} from './baddie';

export class Bot extends Actor {
    public isOnGround = true;
    public isHurt = false;
    public hurtTime: number = 0;

    constructor(x: number, y: number) {
        super({
            name: 'Bot',
            pos: vec(x, y),
            collisionType: CollisionType.Active,
            collisionGroup: CollisionGroupManager.groupByName("player"),
            collider: Shape.Box(32, 50, Vector.Half, vec(0, 3))
        });
    }

    // OnInitialize is called before the 1st actor update
    onInitialize(_engine: Engine) {
        // Initialize actor

        // Setup visuals
        const hurtLeft = Animation.fromSpriteSheet(botSpriteSheet, [0, 1, 0, 1, 0, 1], 150);
        hurtLeft.scale = vec(2, 2);

        const hurtRight = Animation.fromSpriteSheet(botSpriteSheet, [0, 1, 0, 1, 0, 1], 150);
        hurtRight.scale = vec(2, 2);
        hurtRight.flipHorizontal = true;

        const idle = Animation.fromSpriteSheet(botSpriteSheet, [2, 3], 800);
        idle.scale = vec(2, 2);

        const walkLeft = Animation.fromSpriteSheet(botSpriteSheet, [3, 4, 5, 6, 7], 100);
        walkLeft.scale = vec(2, 2);

        const walkRight = Animation.fromSpriteSheet(botSpriteSheet, [3, 4, 5, 6, 7], 100);
        walkRight.scale = vec(2, 2);
        walkRight.flipHorizontal = true;

        // Register animations with actor
        this.graphics.add("hurtleft", hurtLeft);
        this.graphics.add("hurtright", hurtRight);
        this.graphics.add("idle", idle);
        this.graphics.add("left", walkLeft);
        this.graphics.add("right", walkRight);

        // onPostCollision is an event, not a lifecycle meaning it can be subscribed to by other things
        this.on('postcollision', (event) => this.onPostCollision(event));
    }

    onPostCollision(event: PostCollisionEvent) {
        // Bot has collided with its Top of another collider
        console.log(event.other.owner?.name);
        if (event.side === Side.Bottom) {
            this.isOnGround = true;
        }

        // Bot has collided on the side, display hurt animation
        if ((event.side === Side.Left || event.side === Side.Right) && event.other.owner instanceof Baddie) {
            if (this.vel.x < 0 && !this.isHurt) {
                this.graphics.use("hurtleft");
            }
            if (this.vel.x >= 0 && !this.isHurt) {
                this.graphics.use("hurtright");
            }
            this.isHurt = true;
            this.hurtTime = 1_000;
            Resources.hit.play(0.1);
        }
    }

    // After main update, once per frame execute this code
    onPreUpdate(engine: Engine, delta: number) {
        // If hurt, count down
        if (this.hurtTime >= 0 && this.isHurt) {
            this.hurtTime -= delta;
            if (this.hurtTime < 0) {
                this.isHurt = false;
            }
        }

        // Reset x velocity
        this.vel.x = 0;

        // Player input
        if (engine.input.keyboard.isHeld(Keys.Left)) {
            this.vel.x = -150;
        }

        if (engine.input.keyboard.isHeld(Keys.Right)) {
            this.vel.x = 150;
        }

        if (engine.input.keyboard.isHeld(Keys.Up) && this.isOnGround) {
            this.vel.y = -450;
            this.isOnGround = false;
            Resources.jump.play(.1);
        }

        // Change animation based on velocity
        if (this.vel.x < 0 && !this.isHurt) {
            this.graphics.use("left");
        }
        if (this.vel.x > 0 && !this.isHurt) {
            this.graphics.use("right");
        }
        if (this.vel.x === 0 && !this.isHurt) {
            this.graphics.use("idle")
        }
    }
}