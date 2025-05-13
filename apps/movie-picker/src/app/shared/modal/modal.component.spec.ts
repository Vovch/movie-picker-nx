import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ModalComponent} from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isOpen input', () => {
    it('should show modal when isOpen is true', () => {
      component.isOpen = true;
      fixture.detectChanges();

      const modalBackdrop = fixture.nativeElement.querySelector('.modal-backdrop');
      expect(modalBackdrop).toBeTruthy();
    });

    it('should hide modal when isOpen is false', () => {
      component.isOpen = false;
      fixture.detectChanges();

      const modalBackdrop = fixture.nativeElement.querySelector('.modal-backdrop');
      expect(modalBackdrop).toBeNull();
    });
  });

  describe('hideModal output', () => {
    it('should emit hideModal event when handleHideModal is called', () => {
      const emitSpy = jest.spyOn(component.hideModal, 'emit');

      component.handleHideModal();

      expect(emitSpy).toHaveBeenCalled();
    });

    it('should emit hideModal event when close button is clicked', () => {
      const emitSpy = jest.spyOn(component.hideModal, 'emit');

      // Ensure the modal is open before querying for the close button
      component.isOpen = true;
      fixture.detectChanges();

      const closeButton = fixture.nativeElement.querySelector('.close');
      closeButton.click();

      expect(emitSpy).toHaveBeenCalled();
    });
  });
});
