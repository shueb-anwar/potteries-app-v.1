import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBusPage } from './search-bus.page';

describe('SearchBusPage', () => {
  let component: SearchBusPage;
  let fixture: ComponentFixture<SearchBusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchBusPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
