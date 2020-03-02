import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatdistComponent } from './statdist.component';

describe('StatdistComponent', () => {
  let component: StatdistComponent;
  let fixture: ComponentFixture<StatdistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatdistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatdistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
