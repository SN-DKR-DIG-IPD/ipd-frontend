import { DialogService } from './dialog.service';

describe('DialogService', () => {
  let dialogService: DialogService;

  beforeEach(() => {
    dialogService = new DialogService();
  });

  it('should be created', () => {
    expect(dialogService).toBeTruthy();
  });

  it('should emit an event', () => {
    const eventData = { message: 'Test message' };

    let emittedEvent: any;
    dialogService.subjectObservable$.subscribe((event) => {
      emittedEvent = event;
    });

    dialogService.emit(eventData);

    expect(emittedEvent).toEqual(eventData);
  });
});
