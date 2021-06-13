import BaseState, { StateReturn } from './BaseState'
import RunState, { Direction } from './RunState'
import Misty from '../Objects/Misty';
import JumpState from "./JumpState";

export default class IdleState extends BaseState {

    name = 'idle';

    enter(params: {}) {
        this.sprite.body.setVelocityX(0);
        this.sprite.anims.play('misty_idle', true);
        this.sprite.hasDoubleJump = true;
    }

    update(): StateReturn|void {
        if (this.sprite.jumpJustPressed && this.sprite.body.onFloor()) {
            return { type: JumpState };
        } else if (this.cursors.left.isDown) {
            return { type: RunState, params: { direction: Direction.Left }};
        } else if (this.cursors.right.isDown) {
            return { type: RunState, params: { direction: Direction.Right }};
        }
    }
}