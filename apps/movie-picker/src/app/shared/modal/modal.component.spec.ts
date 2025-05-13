import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';

@Component({
  template: `
    <movie-picker-modal [isOpen]="true">
      <ng-content [slot="header"]>Header Content</ng-content>
      <ng-content [slot="body"]>Body Content</ng-content>
      <ng-content [slot="footer"]>Footer Content</ng-content>
    </movie-picker-modal>
  `,
})
class TestHostComponent {}

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalComponent, TestHostComponent],
    }).compileComponents();

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

  describe('slots rendering', () => {
    it('should render header, body, and footer slots when modal is open', () => {
      component.isOpen = true;
      fixture.detectChanges();

      const headerSlot = fixture.nativeElement.querySelector('[slot=header]');
      const bodySlot = fixture.nativeElement.querySelector('[slot=body]');
      const footerSlot = fixture.nativeElement.querySelector('[slot=footer]');

      expect(headerSlot).toBeTruthy();
      expect(bodySlot).toBeTruthy();
      expect(footerSlot).toBeTruthy();
    });

    it('should not render slots when modal is closed', () => {
      component.isOpen = false;
      fixture.detectChanges();

      const headerSlot = fixture.nativeElement.querySelector('[slot=header]');
      const bodySlot = fixture.nativeElement.querySelector('[slot=body]');
      const footerSlot = fixture.nativeElement.querySelector('[slot=footer]');

      expect(headerSlot).toBeNull();
      expect(bodySlot).toBeNull();
      expect(footerSlot).toBeNull();
    });
  });

  describe('content rendering in slots', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(() => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();
    });

    it('should render header content when modal is open', () => {
      const headerContent = hostFixture.nativeElement.querySelector('[slot=header]');
      expect(headerContent).toBeTruthy();
      expect(headerContent.textContent.trim()).toBe('Header Content');
    });

    it('should render body content when modal is open', () => {
      const bodyContent = hostFixture.nativeElement.querySelector('[slot=body]');
      expect(bodyContent).toBeTruthy();
      expect(bodyContent.textContent.trim()).toBe('Body Content');
    });

    it('should render footer content when modal is open', () => {
      const footerContent = hostFixture.nativeElement.querySelector('[slot=footer]');
      expect(footerContent).toBeTruthy();
      expect(footerContent.textContent.trim()).toBe('Footer Content');
    });
  });
});
