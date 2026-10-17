import {Actor, Animation, CollisionType, Engine, type MitraGraphicsContext, Vector} from  "../../../src/engine";

interface AnimationNode {
    position: Vector,
    animation: Animation
}

export class AnimationManager extends Actor {
    private animations: AnimationNode[] = [];

    constructor() {
        super({
            pos: Vector.Zero,
            width: 0,
            height: 0,
            collisionType: CollisionType.PreventCollision,
        });
        this.graphics.onPostDraw = (context) => this.drawAnimations(context);
    }

    play(animation: Animation, position: Vector) {
        this.animations.push({
            animation: animation.clone(),
            position: position.clone()
        });
    }

    onPostUpdate(engine: Engine, elapsed: number) {
        this.animations.forEach(a => a.animation.tick(elapsed, engine.stats.currFrame.id));
        this.animations = this.animations.filter(a => !a.animation.done);
    }

    // PostDraw gives the rendering context and the time between frames
    drawAnimations(context: MitraGraphicsContext) {
        for (let node of this.animations) {
            node.animation.draw(context, node.position.x - node.animation.width / 2, node.position.y - node.animation.height / 2);
        }
    }
}

export const animManager = new AnimationManager();