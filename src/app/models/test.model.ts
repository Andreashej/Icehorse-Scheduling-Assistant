import { Deserializeable } from './deserializeable.model';
import { Venue } from './venue.model';
import { TestBlock } from './testblock.model';

export class Test implements Deserializeable {
    testcode: string;
    origcode: string;
    left_rein_participants: number;
    right_rein_participants: number;
    grouptime: number;
    groupsize: number;
    expected_judges: number;
    allowAFIN: boolean;
    allowBFIN: boolean;
    hasAFIN: boolean;
    hasBFIN: boolean;
    _links: any;

    constructor(tc?, oc?, lr?, rr?) {
        this.testcode = tc;
        this.origcode = oc;
        this.left_rein_participants = lr;
        this.right_rein_participants = rr;
    }

    getDuration(): number {
        return this.getLeftReinHeats() * this.grouptime + this.getRightReinHeats() * this.grouptime;
    }

    getHours(): number {
        return Math.floor(this.getDuration() / 60);
    }

    getMinutes(): number {
        return this.getDuration() % 60;
    }

    getLeftReinHeats(): number {
        return Math.ceil(this.left_rein_participants / this.groupsize);
    }

    getRightReinHeats(): number {
        return Math.ceil(this.right_rein_participants / this.groupsize);
    }

    getGroups(): number {
        return this.getLeftReinHeats() + this.getRightReinHeats();
    }

    getFreePlacesLeft(): number {
        return this.getLeftReinHeats() * this.groupsize - this.left_rein_participants;
    }

    getFreePlacesRight(): number {
        return this.getRightReinHeats() * this.groupsize - this.right_rein_participants;
    }

    getBlockSpan(): number {
        return Math.ceil((this.getDuration() - 0.9) / 5)
    }

    deserialize(input) {
        Object.assign(this, input);

        return this;
    }
}