import {Actor, Collider, vec, Vector} from  "../../src/engine";
import {Level} from "./Level.ts";
import {GameConfig} from "./GameConfig.ts";
import {Resources} from "./Resources.ts";
import {Bird} from "./Bird.ts";

export class ScoreTrigger extends Actor {
    level: Level

    constructor(pos: Vector, level: Level) {
        super({
            pos,
            width: 32,
            height: GameConfig.PipeGap,
            anchor: vec(0, 0),
            vel: vec(-GameConfig.PipeSpeed, 0)
        })
        this.level = level;

        this.on('exitviewport', () => {
            this.kill();
        });
    }

    override onCollisionStart(_self: Collider, other: Collider): void {
        if (other.owner instanceof Bird) {
            this.level.incrementScore();
            Resources.ScoreSound.play();
        }
    }
}
