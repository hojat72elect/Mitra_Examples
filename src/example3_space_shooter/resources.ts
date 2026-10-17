import {ImageSource, Loader, Sound, SpriteSheet} from "../../src/engine";
import fighterFile from './assets/fighter.png';
import enemyFile from './assets/enemy.png';
import spriteexplosionFile from './assets/spriteexplosion.png';
import gameSheetFile from './assets/gameSheet.png';
import laserFile from './assets/laser.wav';
import enemyfireFile from './assets/enemyfire.wav';
import explodeFile from './assets/explode.wav';
import hitFile from './assets/hit.wav';
import powerupFile from './assets/powerup.wav';
import rocketFile from './assets/rocket.wav';

const Images: { [key: string]: ImageSource } = {
    fighter: new ImageSource(fighterFile),
    enemyPink: new ImageSource(enemyFile),
    explosion: new ImageSource(spriteexplosionFile),
    sheet: new ImageSource(gameSheetFile),
};

const Sounds: { [key: string]: Sound } = {
    laserSound: new Sound(laserFile),
    enemyFireSound: new Sound(enemyfireFile),
    explodeSound: new Sound(explodeFile),
    hitSound: new Sound(hitFile),
    powerUp: new Sound(powerupFile),
    rocketSound: new Sound(rocketFile),
}

const explosionSpriteSheet = SpriteSheet.fromImageSource({
    image: Images.explosion,
    grid: {
        rows: 5,
        columns: 5,
        spriteWidth: 45,
        spriteHeight: 45
    }
});
const gameSheet = SpriteSheet.fromImageSource({
    image: Images.sheet,
    grid: {
        rows: 10,
        columns: 10,
        spriteWidth: 32,
        spriteHeight: 32
    }
});

const loader = new Loader();
const allResources = {...Images, ...Sounds};
for (const res in allResources) {
    loader.addResource(allResources[res]);
}

export {Images, Sounds, loader, explosionSpriteSheet, gameSheet};