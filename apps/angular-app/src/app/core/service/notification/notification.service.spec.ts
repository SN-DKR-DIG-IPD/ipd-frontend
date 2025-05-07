import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { NotificationService } from "./notification.service";
import { TestBed } from '@angular/core/testing';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const snackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: snackBarSpyObj }
      ]
    });
    service = TestBed.inject(NotificationService);
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should open a snackbar with default panel class', () => {
    const message = 'Test message';
    service.openSnackBar(message);
    expect(snackBarSpy.open).toHaveBeenCalledWith(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['default']
    });
  });

  it('should open a snackbar with specified panel class', () => {
    const message = 'Test message';
    const panelClass = 'custom';
    service.openSnackBar(message, panelClass);
    expect(snackBarSpy.open).toHaveBeenCalledWith(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: [panelClass]
    });
  });

});
