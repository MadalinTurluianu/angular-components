import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressIndicatorComponent } from './progress-indicator.component';

describe('ProgressIndicatorComponent', () => {
  let component: ProgressIndicatorComponent;
  let fixture: ComponentFixture<ProgressIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressIndicatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressIndicatorComponent);
    component = fixture.componentInstance;
    component.color = 'red';
    component.progress = 50;
    component.radius = 25;
    fixture.detectChanges();
  });

  it('should render', () => {
    const progress = fixture.nativeElement.querySelector(
      "[data-testid='progressbar']"
    );
    expect(progress).toBeTruthy();
  });

  it('should show the correct progress % and have the correct color', () => {
    const progress = fixture.nativeElement.querySelector(
      "[data-testid='progressbar']"
    );
    const correctGradient =
      'conic-gradient(rgb(255, 0, 0) 50%, rgba(0, 0, 0, 0) 50.1%)';
    expect(getComputedStyle(progress).backgroundImage).toEqual(correctGradient);
  });

  it('should have the correct dimension', () => {
    const progress = fixture.nativeElement.querySelector(
      "[data-testid='progressbar']"
    );
    expect(getComputedStyle(progress).width).toEqual(
      component.radius * 2 + 'px'
    );
  });
});
