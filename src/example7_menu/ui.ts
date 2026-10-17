import {Actor, Color, Scene, vec, Vector, Screen} from "../../src/engine";
import {IdleAnimation} from "./resources";

export const calculateExPixelConversion = (screen: Screen) => {
    const origin = screen.worldToPageCoordinates(Vector.Zero);
    const singlePixel = screen.worldToPageCoordinates(vec(1, 0)).sub(origin);
    const pixelConversion = singlePixel.x;
    document.documentElement.style.setProperty('--pixel-conversion', pixelConversion.toString());
}

export class Menu {
    scene: Scene;
    rootElement: HTMLElement;
    addUnitButton: HTMLElement;
    removeUnitButton: HTMLElement;
    currentWorldPos: Vector = vec(0, 0);

    constructor(scene: Scene) {
        this.scene = scene;
        scene.input.pointers.on('down', (event) => {
            this.show();
            this.currentWorldPos = scene.engine.screen.pageToWorldCoordinates(vec(event.pagePos.x, event.pagePos.y));
            document.documentElement.style.setProperty('--pointer-x', event.pagePos.x.toString() + 'px');
            document.documentElement.style.setProperty('--pointer-y', event.pagePos.y.toString() + 'px');
        });

        const rootElement = document.getElementById('menu');
        const addUnitButton = document.getElementById('add-unit');
        const removeUnitButton = document.getElementById('remove-unit');

        if (rootElement && addUnitButton && removeUnitButton) {
            this.rootElement = rootElement;
            this.addUnitButton = addUnitButton;
            this.removeUnitButton = removeUnitButton;

            this.addUnitButton.addEventListener('click', _event => {
                this.addUnit();
            });

            this.removeUnitButton.addEventListener('click', _event => {
                this.removeUnit();
            });
        } else {
            throw Error("Could not initialize menu, element with id='menu'");
        }
    }

    addUnit() {
        const actor = new Actor({
            pos: this.currentWorldPos,
            scale: vec(2, 2),
            color: Color.Red
        });
        actor.graphics.use(IdleAnimation);
        this.scene.add(actor);
        this.hide();
    }

    removeUnit() {
        for (let actor of this.scene.actors) {
            if (actor.graphics.bounds.contains(this.currentWorldPos)) {
                actor.kill();
            }
        }
        this.hide();
    }

    show() {
        this.rootElement.classList.remove('hide');
        this.rootElement.classList.add('show');
    }

    hide() {
        this.rootElement.classList.remove('show');
        this.rootElement.classList.add('hide');
    }
}