import {Component, Entity, Observable} from "../../src/engine";
import {Constraint, type IConstraintDefinition} from 'matter-js';

export class MatterJsConstraintComponent extends Component {
    constraint: Constraint;
    removed$ = new Observable<MatterJsConstraintComponent>();

    constructor(constraintDef: IConstraintDefinition) {
        super();
        this.constraint = Constraint.create(constraintDef)
    }

    onRemove(_previousOwner: Entity): void {
        this.removed$.notifyAll(this);
    }
}