import {Query, System, SystemType, TransformComponent, World} from "../../src/engine";
import {MatterJsBodyComponent} from "./MatterJsBodyComponent";
import Matter from 'matter-js';
import {MatterJsConstraintComponent} from "./MatterJsConstraintComponent";

export class MatterJsSystem extends System {
    // Mitra physics system disabled in new Engine({physics: false})
    public systemType = SystemType.Update;
    matterEngine: Matter.Engine = Matter.Engine.create();
    query: Query<typeof MatterJsBodyComponent | typeof TransformComponent>;

    constructor(world: World) {
        super();
        this.matterEngine.gravity.y = 1;
        this.query = world.query([MatterJsBodyComponent, TransformComponent]);

        this.query.entityAdded$.subscribe(entity => {
            const matterJsComponent = entity.get(MatterJsBodyComponent);

            if (matterJsComponent) {
                Matter.Composite.add(this.matterEngine.world, matterJsComponent.matterJsBody);
            }

            // Optional component
            const matterJsConstraint = entity.get(MatterJsConstraintComponent);
            if (matterJsConstraint) {
                Matter.Composite.add(this.matterEngine.world, matterJsConstraint.constraint);
                matterJsConstraint.removed$.subscribe(() => {
                    Matter.World.remove(this.matterEngine.world, matterJsConstraint.constraint);
                });
            }
        })

        this.query.entityRemoved$.subscribe(() => {
            // TODO remove from matter js
        })
    }

    override update(delta: number) {
        // Update matter js simulation
        Matter.Engine.update(this.matterEngine, delta);
        // Sync transforms from matter to Mitra
        for (let entity of this.query.entities) {
            const transform = entity.get(TransformComponent);
            const matterJsComponent = entity.get(MatterJsBodyComponent);
            if (matterJsComponent && transform) {
                transform.pos.x = matterJsComponent.matterJsBody.position.x;
                transform.pos.y = matterJsComponent.matterJsBody.position.y;
                transform.rotation = matterJsComponent.matterJsBody.angle;
            }
        }
    }
}