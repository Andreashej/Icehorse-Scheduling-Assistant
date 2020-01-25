import { Deserializeable } from './deserializeable.model';

export class Venue implements Deserializeable {
    name: string;
    uri: string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }

}