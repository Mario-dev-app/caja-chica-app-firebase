import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoneyRequestPage } from './money-request.page';

describe('MoneyRequestPage', () => {
  let component: MoneyRequestPage;
  let fixture: ComponentFixture<MoneyRequestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
