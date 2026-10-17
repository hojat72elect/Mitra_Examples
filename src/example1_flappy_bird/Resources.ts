import {ImageSource, ImageWrapping, Sound} from  "../../src/engine";

export const Resources = {
    // Relative to /public in vite

    // Images
    BirdImage: new ImageSource('./assets/images/bird.png'),
    PipeImage: new ImageSource('./assets/images/pipe.png', {
        wrapping: ImageWrapping.Clamp // Clamp is the default
    }),
    GroundImage: new ImageSource('./assets/images/ground.png', {
        wrapping: ImageWrapping.Repeat
    }),

    // Sounds
    FlapSound: new Sound('./assets/sounds/flap.wav'),
    FailSound: new Sound('./assets/sounds/fail.wav'),
    ScoreSound: new Sound('./assets/sounds/score.wav'),

    // Music
    BackgroundMusic: new Sound('./assets/sounds/two_left_socks.ogg', './assets/sounds/two_left_socks.mp3')
} as const;

