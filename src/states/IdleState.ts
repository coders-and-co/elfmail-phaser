import BaseState, { StateReturn, Direction } from './BaseState'
import Misty from '../Objects/Misty';
import JumpState from "./JumpState";
import FallState from './FallState';
import RunState from './RunState';

export default class IdleState extends BaseState {

    name = 'idle';

    enter() {
        // this.sprite.body.setVelocityX(0);
        this.sprite.anims.play('misty_idle', true);
        this.sprite.hasDoubleJump = true;
    }

    update(): StateReturn|void {

        if (this.sprite.body.velocity.x != 0) {
            this.sprite.body.velocity.x *= this.sprite.dampenVelocity.ground;
        }

        if (this.sprite.jumpJustPressed && this.sprite.body.onFloor()) {
            if (this.cursors.down.isDown) {
                return { type: FallState, params: { fallThru: true }};
            } else {
                return { type: JumpState };
            }
        } else if (this.cursors.left.isDown) {
            return { type: RunState, params: { direction: Direction.Left }};
        } else if (this.cursors.right.isDown) {
            return { type: RunState, params: { direction: Direction.Right }};
        }
    }
}