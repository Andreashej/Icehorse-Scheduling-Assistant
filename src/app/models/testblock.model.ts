import { Deserializeable } from './deserializeable.model';
import { Test } from './test.model';
import { Venue } from './venue.model';
import { Timezone } from '@syncfusion/ej2-schedule';

export class TestBlock implements Deserializeable {
    static COLOURS = {
        T1: "#A9D978",
        T2: "#B4FFB3",
        T3: "#67A266",
        T4: "#44985D",
        T5: "#9DB688",
        T8: "#AABCA6",
        V1: "#7194C0",
        GDB: "#7194C0",
        V2: "#4B627F",
        GDT: "#4B627F",
        V3: "#96C4FF",
        GDC: "#96C4FF",
        V5: "#263140",
        GDY: "#263140",
        F1: "#34495e",
        GDA: "#34495e",
        F2: "#87B0E5",
        PP1: "#E74C3C",
        P2: "#C0392B",
        P1: "#A4392C",
        P3: "#A4392C",
        custom: "##d6d8d9"
    }

    block_id: number;
    test: Test;
    phase: string;
    block_number: number;
    starttime: Date;
    endtime: Date;
    venue: number;
    groups: number;
    _links: any;
    grouptime: number;
    competition_id: number;
    label: string;

    getStartTime(): Date {
        return this.starttime;
    }

    getEndTime(): Date {
        return new Date(this.starttime.getTime() + this.getDuration()*60000); 
    }

    getDuration(): number {
        return this.groups * this.grouptime;
    }

    getHours(): number {
        return Math.floor(this.getDuration() / 60);
    }

    getMinutes(): number {
        return this.getDuration() % 60;
    }

    groupsFromDuration() {
        return Math.floor(((this.endtime.getTime() - this.starttime.getTime()) / (1000 * 60)) / this.test.grouptime);
    }

    getColour() {
        return TestBlock.COLOURS[this.test.origcode];
    }

    deserialize(input, tz?) {
        Object.assign(this, input);
        
        this.test = new Test().deserialize(input.test);
        // this.venue = new Venue().deserialize(input.venue);

        if (!tz) {
            this.starttime = new Date(input.starttime + 'Z');
        }

        if(!input.label) {
            this.label = `${this.test.testcode} ${this.phase}`;
        }

        if (!input.grouptime) {
            this.grouptime = this.test.grouptime;
        }

        if(!this.endtime) {
            this.endtime = this.getEndTime();
        }

        return this;
    }
}
