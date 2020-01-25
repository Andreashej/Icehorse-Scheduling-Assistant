import { Competition } from './competition.model';
import { Deserializeable } from './deserializeable.model';

export class User implements Deserializeable {
    userID: Number;
    username: string;
    email: string;
    uri: string;
    competitions: Competition[];

    deserialize(input: any) {
        Object.assign(this, input);
        let index = 0;
        for (let competition of input.competitions) {
            this.competitions[index] = new Competition().deserialize(competition)
            index++;
        }
        return this;
    }
}