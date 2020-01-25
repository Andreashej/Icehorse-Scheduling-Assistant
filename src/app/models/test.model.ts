import { Deserializeable } from './deserializeable.model';
import { Venue } from './venue.model';

export class Test implements Deserializeable {
    testcode: string;
    origcode: string;
    starttime: Date;
    endtime: Date;
    left_rein_participants: number;
    right_rein_participants: number;
    grouptime: number;
    groupsize: number;
    expected_judges: number;
    phase: string;
    uri: string;
    venue: Venue;
    venue_uri: string;
    section: number;
    afin: string;
    bfin: string;
    blockIndex: number;

    constructor(tc?, oc?, lr?, rr?, phase='prel') {
        this.testcode = tc;
        this.origcode = oc;
        this.left_rein_participants = lr;
        this.right_rein_participants = rr;
        this.phase = phase;
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

    getFreePlacesLeft(): number {
        return this.getLeftReinHeats() * this.groupsize - this.left_rein_participants;
    }

    getFreePlacesRight(): number {
        return this.getRightReinHeats() * this.groupsize - this.right_rein_participants;
    }

    getStartTime(): Date {
        return this.starttime;
    }

    getEndTime(): Date {
        return new Date(this.starttime.getTime() + this.getDuration()*60000); 
    }

    getBlockSpan(): number {
        return Math.ceil((this.getDuration() - 0.9) / 5)
    }

    deserialize(input) {
        // console.log(input);
        Object.assign(this, input);
        if(input.starttime) {
            this.starttime = new Date(input.starttime);
            this.endtime = this.getEndTime();
            this.venue = new Venue().deserialize(input.venue);
            if (!input.venue_uri) {
                this.venue_uri = this.venue.uri;
            }
        }
        return this;
    }
}