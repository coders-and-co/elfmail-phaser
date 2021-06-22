import Phaser, { GameObjects, Scene } from 'phaser';
import Misty from '../Objects/Misty';

export interface StateReturn {
    type: typeof BaseState;
    params?: any
}

export default class BaseState {

    name = 'basestate';
    sprite!: Misty;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    // gamepad!: Phaser.Input.Gamepad.Gamepad;

    constructor(sprite: Misty, cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        this.sprite = sprite;
        this.cursors = cursors;
        // this.gamepad = gamepad;
    }

    enter(params: any): void {
        // ... enter ...
    }

    exit(): void {
        // ... exit ...
    }

    update(delta: number): StateReturn|void {
        // ... update ...
    }

    playSound(name: string, volume?: number){
        var soundEffect = this.sprite.scene.sound.add(name);
        soundEffect.play({
            loop: false,
            volume: volume? volume : 1
        });
    }

    getControls() {

        const gamepad = this.sprite.gamepad;
        // if (gamepad)
        //     console.log(gamepad.leftStick)

        return {
            up: this.cursors.up.isDown || gamepad && gamepad.up,
            down: this.cursors.down.isDown || gamepad && gamepad.down,
            left: this.cursors.left.isDown || gamepad && (gamepad.left || gamepad.leftStick.x < -0.3),
            right: this.cursors.right.isDown || gamepad && (gamepad.right || gamepad.leftStick.x > 0.3),
            jump: this.cursors.space.isDown || gamepad && gamepad.A,
            jumpJustPressed: this.sprite.jumpJustPressed,
        }

    }

}