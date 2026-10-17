import {Actor, Engine, ImageWrapping, TiledSprite, vec, Vector} from  "../../src/engine";
import {Resources} from "./Resources.ts";
import {GameConfig} from "./GameConfig.ts";

export class Ground extends Actor {
    groundSprite = Resources.GroundImage.toSprite();
    moving = false;

    constructor(pos: Vector) {
        super({
            pos,
            anchor: vec(0, 0),
            height: 64,
            width: 400,
            z: 1
        })
    }

    onInitialize(engine: Engine): void {

        this.groundSprite = new TiledSprite({
            image: Resources.GroundImage,
            width: engine.screen.drawWidth,
            height: 64,
            wrapping: {
                x: ImageWrapping.Repeat,
                y: ImageWrapping.Clamp
            }
        });

        this.graphics.use(this.groundSprite);
    }

    onPostUpdate(_engine: Engine, elapsedMs: number): void {
        if (!this.moving) return;
        // scroll the tiled sprite to the right, clamp to the width to keep the uv's small preventing visual
        // artifacts due to floating point
        this.groundSprite.sourceView.x += GameConfig.PipeSpeed * (elapsedMs / 1000);
        this.groundSprite.sourceView.x = this.groundSprite.sourceView.x % Resources.GroundImage.width;
    }

    start() {
        this.moving = true;
    }

    stop() {
        this.moving = false;
    }
}
