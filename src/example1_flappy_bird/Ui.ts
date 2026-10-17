import {Resources} from "./Resources.ts";

export function initializeMuteButton() {
    const muteButton = document.getElementById('mute');
    if (muteButton) {
        muteButton.addEventListener('click', toggleButtonClickHandler);
        muteButton.addEventListener('keydown', toggleButtonKeydownHandler);
        muteButton.addEventListener('keyup', toggleButtonKeyupHandler);
    }
}

/**
 * Toggles the toggle button’s state if it’s actually a button element or has
 * the `role` attribute set to `button`.
 */
function toggleButtonClickHandler(event: MouseEvent) {
    toggleButtonState(event!.currentTarget as HTMLButtonElement);
}

/**
 * Toggles the toggle button’s state with the enter key.
 */
function toggleButtonKeydownHandler(event: KeyboardEvent) {
    if (event.code === "Space") {
        event.preventDefault();
    } else if (event.code === "Enter") {
        event.preventDefault();
        toggleButtonState(event!.currentTarget as HTMLButtonElement);
    }
}

/**
 * Toggles the toggle button’s state with space key.
 */
function toggleButtonKeyupHandler(event: KeyboardEvent) {
    if (event.code === "Space") {
        event.preventDefault();
        toggleButtonState(event!.currentTarget as HTMLButtonElement);
    }
}

/**
 * Toggles the toggle button’s state between *pressed* and *not pressed*.
 */
function toggleButtonState(button: HTMLElement) {
    const isAriaPressed = button.getAttribute('aria-pressed') === 'true';

    button.setAttribute('aria-pressed', isAriaPressed ? 'false' : 'true');

    if (!isAriaPressed) {
        Resources.BackgroundMusic.volume = 0;
        Resources.FlapSound.volume = 0;
        Resources.FailSound.volume = 0;
    } else {
        Resources.BackgroundMusic.volume = 1;
        Resources.FlapSound.volume = 1;
        Resources.FailSound.volume = 1;
    }
}
