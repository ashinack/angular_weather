import { Component } from '@angular/core';
import { WeatherService } from '../weather.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-weather-check-page',
  templateUrl: './weather-check-page.component.html',
  styleUrl: './weather-check-page.component.scss',
})
export class WeatherCheckPageComponent {
  weatherData: any;
  city: any;
  locationName: any;
  currentDate: any;
  day: any;
  remaining: any;

  constructor(
    private weatherService: WeatherService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.currentDate = new Date();
    this.currentDate = this.datePipe.transform(
      this.currentDate,
      'EEEE, MMMM d, y'
    );
    [this.day, ...this.remaining] = this.currentDate.split(', ');
    //console.log(day, 'currentdata---', remaining);

    this.getGeoLocation();
  }

  clearText() {
    this.city = '';
  }

  getWeather(city: any) {
    this.weatherService.getWeather(city).subscribe(
      (data) => {
        this.weatherData = data;
        this.updateBackground(this.weatherData.weather[0].main);
      },
      (error) => {
        console.error('Error fetching weather data', error);
      }
    );
  }

  updateBackground(weatherCondition: string) {
    switch (weatherCondition.toLowerCase()) {
      case 'clear':
        console.log('clear');

        // this.backgroundImage = 'assets/weather-backgrounds/sunny.jpg';
        break;
      case 'clouds':
        console.log('clouds');
        // this.backgroundImage = 'assets/weather-backgrounds/cloudy.jpg';
        break;
      case 'rain':
        console.log('rain');
        break;
      case 'drizzle':
        console.log('drizzle');

        // this.backgroundImage = 'assets/weather-backgrounds/rainy.jpg';
        break;
      case 'snow':
        console.log('snow');

        // this.backgroundImage = 'assets/weather-backgrounds/snow.jpg';
        break;
      case 'thunderstorm':
        console.log('thunderstorm');

        // this.backgroundImage = 'assets/weather-backgrounds/thunderstorm.jpg';
        break;
      default:
        console.log('default');

        // this.backgroundImage = 'assets/weather-backgrounds/default.jpg';
        break;
    }
  }

  getGeoLocation() {
    this.weatherService.getCurrentPosition().subscribe({
      next: (position) => {
        console.log(position);

        console.log('Latitude:', position.coords.latitude);
        console.log('Longitude:', position.coords.longitude);
        this.getLocationName(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      error: (error) => {
        console.error('Error getting geolocation:', error);
      },
    });
  }

  getLocationName(lat: number, lng: number): void {
    console.log(lat, 'lat', lng);

    this.weatherService.getLocationName(lat, lng).subscribe((response) => {
      console.log(response.name, 'res');
      this.getWeather(response.name);
      // this.city = response.name;
      if (response.results && response.results.length > 0) {
        this.locationName = response.results[0].formatted_address;
        console.log('Location Name:', this.locationName);
      } else {
        console.warn('No location found.');
      }
    });
  }
}
