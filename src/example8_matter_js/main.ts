import {CollisionType, Color, DisplayMode, Engine, Keys, Random, vec} from "../../src/engine";
import {MatterJsSystem} from "./MatterJsSystem";
import {Block} from "./block";

const game = new Engine({
    width: 600,
    height: 400,
    physics: false, // Turn off Mitra physics (we turn off our own physics so we can use matter js instead)
    displayMode: DisplayMode.FitScreenAndFill,
    fixedUpdateFps: 60
});

game.currentScene.world.systemManager.addSystem(MatterJsSystem);
const floor = new Block({
    pos: vec(400, 400),
    width: 800,
    height: 20,
    color: Color.Black,
    collisionType: CollisionType.Fixed
});
game.add(floor);

const block = new Block({
    pos: vec(300, 0),
    width: 20,
    height: 20,
    color: Color.Red
});
game.add(block);

const constrainedBlock = new Block({
    pos: vec(200, 100),
    width: 100,
    height: 100,
    color: Color.Red
});
constrainedBlock.addStiffConstraint(vec(300, 100), vec(0, 0));
game.add(constrainedBlock);

const random = new Random(1337);
game.input.pointers.primary.on('down', evt => {
    const newBlock = new Block({
        pos: evt.worldPos,
        width: 20,
        height: 20,
        color: new Color(random.integer(0, 255), random.integer(0, 255), random.integer(0, 255))
    });
    game.add(newBlock);
});

game.input.keyboard.on('press', (evt) => {
    if (evt.key === Keys.D) {
        constrainedBlock.removeConstraints();
    }
})

game.start();
