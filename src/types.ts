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