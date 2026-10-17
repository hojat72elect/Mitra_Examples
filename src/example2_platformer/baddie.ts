import {baddieSpriteSheet, Resources} from "./resources";
import {Bot} from './bot';
import {
    Actor,
    Animation,
    CollisionGroupManager,
    CollisionType,
    Engine,
    PostCollisionEvent,
    Shape,
    Side,
    vec,
    Vector,
} from  "../../src/engine";

export class Baddie extends Actor {
    direction: number;

    constructor(x: number, y: number, direction: number) {
        super({
            name: 'Baddie',
            pos: vec(x, y),
            collisionGroup: CollisionGroupManager.groupByName("enemy"),
            collisionType: CollisionType.Active,
            collider: Shape.Box(32, 50, Vector.Half, vec(0, -1))
        });
        this.direction = direction;
    }

    // onInitialize is called before the 1st actor update
    onInitialize(_engine: Engine) {
        // Initialize the actor

        // Setup visuals
        const leftAnimation = Animation.fromSpriteSheet(baddieSpriteSheet, [2, 3, 4, 5], 100);
        leftAnimation.scale = vec(2, 2);
        const rightAnimation = Animation.fromSpriteSheet(baddieSpriteSheet, [2, 3, 4, 5], 100);
        rightAnimation.scale = vec(2, 2);
        rightAnimation.flipHorizontal = true;

        // Register animation
        this.graphics.add("left", leftAnimation)
        this.graphics.add("right", rightAnimation);
        this.graphics.use("left");

        if ((window as any).__TESTING) {
            leftAnimation.pause();
        }

        // Setup patrolling behavior

        // For the test harness to be predictable
        if (!(window as any).__TESTING) {
            this.actions.delay(1_000)
                .repeatForever(context => context
                    .moveBy(400 * this.direction, 0, 100)
                    .moveBy(-400 * this.direction, 0, 100));
        }

        // Handle being stomped by the player
        this.on('postcollision', (event) => this.onPostCollision(event));
    }

    onPostCollision(event: PostCollisionEvent) {
        if (event.other.owner instanceof Bot && event.side === Side.Top) {
            Resources.gotEm.play(.1);
            // Clear patrolling
            this.actions.clearActions();
            // Remove ability to collide
            this.body.collisionType = CollisionType.PreventCollision;

            // Launch into air with rotation
            this.vel = vec(0, -300);
            this.acc = vec(0, 800);
            this.angularVelocity = 2;
        }
    }

    // Change animation based on velocity 
    onPostUpdate() {
        if (this.vel.x < 0) {
            // Play left animation
            this.graphics.use("left");
        } else if (this.vel.x > 0) {
            // Play right animation
            this.graphics.use("right");
        }
    }

}