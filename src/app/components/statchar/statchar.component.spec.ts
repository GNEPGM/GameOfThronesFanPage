import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatcharComponent } from './statchar.component';

describe('StatcharComponent', () => {
  let component: StatcharComponent;
  let fixture: ComponentFixture<StatcharComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatcharComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatcharComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
