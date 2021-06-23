import Elfmail from '../scenes/Game';
import Phaser, { GameObjects, Scene } from 'phaser';
import Misty from '../Objects/Misty';
import { KeyDict, KeyMap } from '../types';

export interface StateReturn {
    type: typeof BaseState;
    params?: any
}

export default class BaseState {

    name = 'basestate';
    sprite!: Misty;

    constructor(sprite: Misty) {
        this.sprite = sprite;
    }

    enter(params: any): void {
        // ... enter ...
    }

    exit(nextType: typeof BaseState): void {
        // ... exit ...
    }

    update(delta: number, controls: KeyMap): StateReturn|void {
        // ... update ...
    }

    // allows for states to call this.playSound rather than trying to find
    // the scene directly
    playSound(name: string, volume?: number){
        (this.sprite.scene as Elfmail).playSound(name, volume);
    }

}