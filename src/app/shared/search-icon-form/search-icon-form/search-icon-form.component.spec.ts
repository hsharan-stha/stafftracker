import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchIconFormComponent } from './search-icon-form.component';

describe('SearchIconFormComponent', () => {
  let component: SearchIconFormComponent;
  let fixture: ComponentFixture<SearchIconFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchIconFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchIconFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
