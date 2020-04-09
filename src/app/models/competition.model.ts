import { Time } from '@angular/common';
import { Test } from './test.model';
import { Deserializeable } from './deserializeable.model';
import { Venue } from './venue.model';

export class Competition implements Deserializeable {
    name: string;
    startdate: Date;
    enddate: Date;
    venues: Venue[];
    _links: any;
    venue: string; // Temp var used to build the query for adding a track to the competition
    user: Number; // As above

    constructor(name?: string, startdate?: Date, enddate?: Date) {
        this.name = name;
        this.startdate = startdate;
        this.enddate = enddate;
    }
    
    getStartDate(): string {
        let month = (this.startdate.getMonth() + 1).toString();
        let date = this.startdate.getDate().toString();
        if (month.length < 2) {
            month = '0' + month;
        }
        if (date.length < 2) {
            date = '0' + date;
        }

        return `${this.startdate.getFullYear()}-${month}-${date}`;
    }

    setStartDate(date: Date): void {
        this.startdate = this.dateToUTC(date);
    }
    
    getEndDate(): string {
        let month = (this.enddate.getMonth() + 1).toString();
        let date = this.enddate.getDate().toString();
        if (month.length < 2) {
            month = '0' + month;
        }
        if (date.length < 2) {
            date = '0' + date;
        }

        return `${this.enddate.getFullYear()}-${month}-${date}`;
    }

    setEndDate(date: Date): void {
        this.enddate = this.dateToUTC(date);
    }

    dateToUTC(date: Date): Date {
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    }

    getDays(): number {
        return (this.enddate.getTime() - this.startdate.getTime()) / 1000 / 60 / 60 / 24 + 1;
    }

    getDaysAsArray() {
        let days: Date[] = [];
        for (let i = 0; i < this.getDays(); i++) {
            let newDate = new Date(this.startdate);
            newDate.setDate(newDate.getDate() + i);

            days.push(newDate);
        }
        return days;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        this.startdate = new Date(input.startdate + 'Z');
        this.enddate = new Date(input.enddate + 'Z');

        let index = 0;
        for (let venue of input.venues) {
            this.venues[index] = new Venue().deserialize(venue)
            index++;
        }

        return this;
    }
}