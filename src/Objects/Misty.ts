import Phaser, { Scene } from 'phaser';
import BaseState from '../states/BaseState';
import IdleState from '../states/IdleState';

type SpriteWithDynamicBody = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

export default class Misty extends Phaser.GameObjects.Sprite {

    movementState: BaseState|null = null;
    body: any;
    runSpeed = 320;

    constructor(scene:Scene, x: number, y: number, texture: string, frame?: number) {
        super(scene, x, y, texture, frame); // The frame is optional
    }

}
