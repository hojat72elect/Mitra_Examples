import {ImageSource, Loader, Sound, SpriteSheet} from "../../src/engine";

// Ensure all resource paths are correct relative to the built output (webpack config)
export const Resources = {
    bot: new ImageSource('./assets/excalibot.png'),
    botRed: new ImageSource('./assets/excalibot-red.png'),
    baddie: new ImageSource('./assets/baddie.png'),
    block: new ImageSource('./assets/block.png'),
    npc: new ImageSource('./assets/npc.png'),
    jump: new Sound('./assets/jump.wav'),
    hit: new Sound('./assets/hurt.wav'),
    gotEm: new Sound('./assets/gottem.wav')
}
export const loader = new Loader();
export const botSpriteSheet = SpriteSheet.fromImageSource({
    image: Resources.bot,
    grid: {
        columns: 8,
        rows: 1,
        spriteWidth: 32,
        spriteHeight: 32
    }
});
export const botRedSpriteSheet = SpriteSheet.fromImageSource({
    image: Resources.botRed,
    grid: {
        columns: 8,
        rows: 1,
        spriteWidth: 32,
        spriteHeight: 32
    }
});
export const baddieSpriteSheet = SpriteSheet.fromImageSource({
    image: Resources.baddie,
    grid: {
        columns: 6,
        rows: 1,
        spriteWidth: 32,
        spriteHeight: 32
    }
});
export const blockSprite = Resources.block.toSprite();
export const npcSprite = Resources.npc.toSprite();

for (const resource of Object.values(Resources)) {
    loader.addResource(resource);
}
