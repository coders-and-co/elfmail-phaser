import Phaser, { Scene } from 'phaser';
import BaseState from '../states/BaseState';
import IdleState from '../states/IdleState';


export default class Misty extends Phaser.GameObjects.Sprite {


    movementState: BaseState = new IdleState();

    // constructor(scene:Scene, x: number, y: number) {
    //     super(scene, x, y, 'Texture', 'Frame'); // The frame is optional
    // }

    function create (){

    }

}
