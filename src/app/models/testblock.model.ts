import { Deserializeable } from './deserializeable.model';
import { Test } from './test.model';
import { Venue } from './venue.model';
import { Timezone } from '@syncfusion/ej2-schedule';

export class TestBlock implements Deserializeable {
    static COLOURS = {
        T1: {bg: "#A9D978", text: "#000000"},
        T2: {bg: "#B4FFB3", text: "#000000"},
        T3: {bg: "#67A266", text: "#000000"},
        T4: {bg: "#44985D", text: "#ffffff"},
        T5: {bg: "#9DB688", text: "#000000"},
        T7: {bg: "#AABCA6", text: "#000000"},
        T8: {bg: "#AABCA6", text: "#000000"},
        V1: {bg: "#7194C0", text: "#000000"},
        GDB: {bg: "#7194C0", text: "#000000"},
        V2: {bg: "#4B627F", text: "#ffffff"},
        GDT: {bg: "#4B627F", text: "#ffffff"},
        V3: {bg: "#96C4FF", text: "#000000"},
        GDC: {bg: "#96C4FF", text: "#000000"},
        V5: {bg: "#263140", text: "#ffffff"},
        GDY: {bg: "#263140", text: "#ffffff"},
        F1: {bg: "#34495e", text: "#ffffff"},
        GDA: {bg: "#34495e", text: "#ffffff"},
        F2: {bg: "#87B0E5", text: "#000000"},
        PP1: {bg: "#E74C3C", text: "#ffffff"},
        P2: {bg: "#C0392B", text: "#ffffff"},
        P1: {bg: "#A4392C", text: "#ffffff"},
        P3: {bg: "#A4392C", text: "#ffffff"},
        CUSTOM: {bg: "#d6d8d9", text: "#000000"}
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

    setStartTime(date: Date) {
        let tz: Timezone = new Timezone();

        this.starttime = tz.removeLocalOffset(date);
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
        return this.test.origcode ? TestBlock.COLOURS[this.test.origcode] : TestBlock.COLOURS.CUSTOM;
    }

    timeToUTC(date: Date): Date {
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
    }

    deserialize(input, tz?) {
        Object.assign(this, input);
        
        this.test = new Test().deserialize(input.test);

        if (!tz) {
            this.starttime = new Date(input.starttime + 'Z');
        }

        if(!input.label) {
            this.label = `${this.test.testcode} ${this.phase}`;

            if (this.block_number) {
                this.label += ` Block ${this.block_number}`;
            }
            if (this.phase === 'PREL') {
                this.label += ` (${this.groups})`;
            }
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
