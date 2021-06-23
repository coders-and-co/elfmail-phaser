import Peep from './Objects/Peep';
import Letter from './Objects/Letter';

export enum DeliveryState {
    Waiting,
    PickedUp,
    Delivered,
}

export interface Delivery {
    sender: Peep,
    receiver: Peep,
    letter: Letter,
    message: string,
    state: DeliveryState,
}

export interface Point {
    x: number;
    y: number;
}

export type KeyDict = {[key: string]: Phaser.Input.Keyboard.Key};
export interface KeyMap {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    jump: boolean;
    jumpJustPressed: boolean;
};