import {Actor, type ActorArgs, CollisionType, Vector} from "../../src/engine";
import {MatterJsBodyComponent} from "./MatterJsBodyComponent";
import {MatterJsConstraintComponent} from "./MatterJsConstraintComponent";

export class Block extends Actor {
    matterJs: MatterJsBodyComponent;

    constructor(config: ActorArgs) {
        super(config);

        this.matterJs = new MatterJsBodyComponent(
            this.width,
            this.height,
            config.collisionType === CollisionType.Fixed
        );
        this.addComponent(this.matterJs);
    }

    addStiffConstraint(pointA: Vector, pointB: Vector) {
        this.addComponent(new MatterJsConstraintComponent({
            pointA,
            pointB,
            bodyB: this.matterJs.matterJsBody
        }));
    }

    removeConstraints() {
        const component = this.get(MatterJsConstraintComponent)
        if (component) {
            this.removeComponent(component, true);
        }
    }
}