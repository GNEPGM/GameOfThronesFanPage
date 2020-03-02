import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatdeadComponent } from './statdead.component';

describe('StatdeadComponent', () => {
  let component: StatdeadComponent;
  let fixture: ComponentFixture<StatdeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatdeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatdeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
