import {Component, Entity, TransformComponent} from "../../src/engine";
import {Bodies, Body} from 'matter-js';

export class MatterJsBodyComponent extends Component {
    matterJsBody!: Body;
    width: number;
    height: number;
    isStatic: boolean;

    constructor(width: number, height: number, isStatic = false) {
        super();
        this.width = width;
        this.height = height;
        this.isStatic = isStatic;
    }

    onAdd(owner: Entity) {
        const transform = owner.get(TransformComponent);
        if (transform) {
            this.matterJsBody = Bodies.rectangle(
                transform.pos.x,
                transform.pos.y,
                this.width,
                this.height, {isStatic: this.isStatic});
        }
    }

}