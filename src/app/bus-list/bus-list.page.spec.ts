import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusListPage } from './bus-list.page';

describe('BusListPage', () => {
  let component: BusListPage;
  let fixture: ComponentFixture<BusListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
