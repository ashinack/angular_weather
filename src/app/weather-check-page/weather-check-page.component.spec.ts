import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherCheckPageComponent } from './weather-check-page.component';

describe('WeatherCheckPageComponent', () => {
  let component: WeatherCheckPageComponent;
  let fixture: ComponentFixture<WeatherCheckPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeatherCheckPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeatherCheckPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
