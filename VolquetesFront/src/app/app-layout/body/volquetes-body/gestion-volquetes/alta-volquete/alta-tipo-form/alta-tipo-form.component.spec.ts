import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaFormComponent } from './alta-tipo-form.component';

describe('AltaFormComponent', () => {
  let component: AltaFormComponent;
  let fixture: ComponentFixture<AltaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
