import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAreaPlaceholderComponent } from './text-area-placeholder.component';

describe('TextAreaPlaceholderComponent', () => {
  let component: TextAreaPlaceholderComponent;
  let fixture: ComponentFixture<TextAreaPlaceholderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextAreaPlaceholderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextAreaPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
