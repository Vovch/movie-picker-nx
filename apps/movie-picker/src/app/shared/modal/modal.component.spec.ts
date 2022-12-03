import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ModalComponent} from './modal.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {HttpClient} from "@angular/common/http";

jest.createMockFromModule('../../authentication.service')

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [HttpClientTestingModule, HttpClient],
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
});
