import BaseState from './BaseState';
import IdleState from './IdleState';
import Misty from '../objects/Misty';


export default class FallState implements BaseState {

    sprite: Misty;

    constructor(sprite: Misty, cursors:  Phaser.Types.Input.Keyboard.CursorKeys) {
        this.sprite = sprite;
        this.sprite.anims.play('misty_fall', true);
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
        if (!cursors.right.isDown && !cursors.left.isDown) {
            this.sprite.body.velocity.x = this.sprite.body.velocity.x * 0.90;
        }
        if (this.sprite.body.onFloor()) {
            return new IdleState(this.sprite);
        }
    }
}