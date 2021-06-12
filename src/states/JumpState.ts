import BaseState from './BaseState';
import IdleState from './IdleState';
import FallState from './FallState';
import Misty from '../objects/Misty';


export default class JumpState implements BaseState {

    sprite: Misty;

    constructor(sprite: Misty, cursors:  Phaser.Types.Input.Keyboard.CursorKeys) {
        this.sprite = sprite;
        this.sprite.anims.play('misty_jump', true);
        this.sprite.body.setVelocityY(-800);
    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys): BaseState|void {
        if (cursors.left.isDown) {
            this.sprite.setFlip(true, false);
            this.sprite.body.setVelocityX(-this.sprite.runSpeed);
        }
        if (cursors.right.isDown) {
            this.sprite.setFlip(false, false);
            this.sprite.body.setVelocityX(this.sprite.runSpeed);
        }
        if (this.sprite.body.velocity.y > 0) {
            return new FallState(this.sprite, cursors);
        }
        // Keep this state in case you jump directly to a platform and never attain + velocity
        if (this.sprite.body.onFloor()) {
            return new IdleState(this.sprite);
        }
    }

}