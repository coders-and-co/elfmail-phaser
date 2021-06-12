import BaseState from './BaseState'
import RunState, { Direction } from './RunState'
import Misty from '../objects/Misty';
import JumpState from "./JumpState";

export default class IdleState implements BaseState {

    sprite: Misty;

    constructor(sprite: Misty) {
        this.sprite = sprite;
        this.sprite.body.setVelocityX(0);
        this.sprite.anims.play('misty_idle', true);
    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys): BaseState|void {
        if (cursors.left.isDown) {
            return new RunState(this.sprite, Direction.Left);
        }
        if (cursors.right.isDown) {
            return new RunState(this.sprite, Direction.Right);
        }
        if (cursors.space.isDown && this.sprite.body.onFloor()) {
            return new JumpState(this.sprite, cursors);
        }
    }
}