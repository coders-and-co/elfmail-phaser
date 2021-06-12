import Phaser, { GameObjects } from 'phaser';
import Misty from '../objects/Misty';

export default interface BaseState {

    sprite: Misty;

    // constructor(obj: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    //     this.sprite = obj;
    // }
    // enter(): void;
    // exit(): void;

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys): BaseState|void;

}