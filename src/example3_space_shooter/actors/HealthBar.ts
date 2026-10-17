import {Actor, Canvas, CollisionType, Color, CoordPlane, Vector} from "../../../src/engine";
import {Config} from "../config";
import {stats} from "../stats";

export class HealthBar extends Actor {
    healthBarWidth = Config.healthBarWidth;

    constructor() {
        super({
            name: "healthbar",
            color: Color.Green,
            pos: new Vector(20, 20),
        });

        this.transform.coordPlane = CoordPlane.Screen;
        this.body.collisionType = CollisionType.PreventCollision
        this.graphics.anchor = Vector.Zero;
        this.graphics.use(new Canvas({
            draw: (ctx) => this.draw(ctx),
            cache: false,
            width: Config.healthBarWidth + 20,
            height: Config.healthBarHeight + 50
        }));
    }

    onPreUpdate() {
        this.healthBarWidth = Config.healthBarWidth * (stats.hp / Config.totalHp);
    }

    draw(context: CanvasRenderingContext2D) {
        context.strokeStyle = this.color.toString();
        context.fillStyle = this.color.toString();
        context.lineWidth = 3;
        context.font = 'normal 30px Open Sans'
        context.fillText("HP", 0, 30);
        context.strokeRect(0, 35, Config.healthBarWidth + 10, Config.healthBarHeight + 10);
        context.fillRect(5, 40, this.healthBarWidth, Config.healthBarHeight);
    }
}
