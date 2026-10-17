import {Actor, Color, vec, Vector} from  "../../src/engine";
import {GameConfig} from "./GameConfig.ts";
import {Resources} from "./Resources.ts";

export class Pipe extends Actor {
    type: 'top' | 'bottom';

    constructor(pos: Vector, type: 'top' | 'bottom') {
        super({
            pos,
            width: 32,
            height: 1000,
            anchor: type === 'bottom' ? vec(0, 0) : vec(0, 1),
            color: Color.Green,
            vel: vec(-GameConfig.PipeSpeed, 0),
            z: -1
        })
        this.type = type;
        this.on('exitviewport', () => this.kill());
    }

    override onInitialize(): void {
        const pipeEnd = Resources.PipeImage.toSprite();
        // Stretch the pipe sprite
        // by default ImageSource use clamp which re-uses the border pixels 
        // when sourceView is larger than the original image
        pipeEnd.sourceView.height = 1000;
        pipeEnd.destSize.height = 1000;

        // Flip the pipe sprite
        if (this.type === 'top') {
            pipeEnd.flipVertical = true;
        }
        this.graphics.use(pipeEnd);
    }
}