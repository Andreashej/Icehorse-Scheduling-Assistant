import { TestBed, inject } from '@angular/core/testing';

import { CompetitionHandlerService } from './competition.handler.service';

describe('CompetitionHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompetitionHandlerService]
    });
  });

  it('should be created', inject([CompetitionHandlerService], (service: CompetitionHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
