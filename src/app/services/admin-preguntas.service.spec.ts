import { TestBed } from '@angular/core/testing';

import { AdminPreguntasService } from './admin-preguntas.service';

describe('AdminPreguntasService', () => {
  let service: AdminPreguntasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminPreguntasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
