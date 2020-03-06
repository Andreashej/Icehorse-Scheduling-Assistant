import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class GlobalUpdateService {
    update;
}
