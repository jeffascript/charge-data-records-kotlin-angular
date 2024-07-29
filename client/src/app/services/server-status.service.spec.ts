import { TestBed } from '@angular/core/testing';
import { ServerStatusService } from './server-status.service';
import { HttpService } from './http.service';
import { of, throwError } from 'rxjs';

describe('ServerStatusService', () => {
  let service: ServerStatusService;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    const httpServiceSpyObj = jasmine.createSpyObj('HttpService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        ServerStatusService,
        { provide: HttpService, useValue: httpServiceSpyObj },
      ],
    });

    service = TestBed.inject(ServerStatusService);
    httpServiceSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true when server is alive', (done) => {
    httpServiceSpy.get.and.returnValue(of({}));

    service.checkServerStatus().subscribe((isAlive) => {
      expect(isAlive).toBeTrue();
      done();
    });
  });

  it('should return false when server is not alive', (done) => {
    httpServiceSpy.get.and.returnValue(throwError('Error'));

    service.checkServerStatus().subscribe((isAlive) => {
      expect(isAlive).toBeFalse();
      done();
    });
  });
});
