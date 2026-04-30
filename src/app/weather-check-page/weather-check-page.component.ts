import { Component, Inject, Renderer2 } from '@angular/core';
import { WeatherService } from '../weather.service';
import { DatePipe, DOCUMENT } from '@angular/common';

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
  backgroundImage: any;
  position: any;
  repeat: any;
  size: any;
  public isLightThemeActive: boolean = true;
  theme: any;
  cityOptions: any[] = [];
  isLoading: boolean = true;

  constructor(
    private weatherService: WeatherService,
    private datePipe: DatePipe,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnInit(): void {
    const currentHour = new Date().getHours();

    this.theme = JSON.parse(localStorage.getItem('theme') || '"light"');
    if (currentHour >= 18 || currentHour < 6) {
      this.theme = 'dark';
    } else {
      this.theme = 'light';
      console.log('');
    }
    this.isLightThemeActive = this.theme == 'light' ? true : false;
    this.currentDate = new Date();
    this.currentDate = this.datePipe.transform(
      this.currentDate,
      'EEEE, MMMM d, y',
    );
    [this.day, ...this.remaining] = this.currentDate.split(', ');
    this.getGeoLocation();
  }

  public toggleTheme(): void {
    this.isLightThemeActive = !this.isLightThemeActive;
    this.theme = this.isLightThemeActive ? 'light' : 'dark';
    this.renderer.removeClass(
      this.document.body,
      this.isLightThemeActive ? 'dark' : 'light',
    );
    this.renderer.addClass(this.document.body, this.theme);
    localStorage.setItem('theme', JSON.stringify(this.theme));
  }

  clearText() {
    this.city = '';
  }

  getWeather(city: any) {
    this.isLoading = true;
    this.weatherService.getWeather(city).subscribe(
      (data) => {
        this.weatherData = data;
        this.updateBackground(this.weatherData.weather[0].main);
        // ✅ NEW
        this.generateInsight(data);
        this.getForecast(city);
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.error('Error fetching weather data', error);
      },
    );
  }

  updateBackground(weatherCondition: string) {
    switch (weatherCondition.toLowerCase()) {
      case 'mist':
      case 'fog':
        this.backgroundImage = {
          'background-image': 'url(/assets/images/smog-removebg-preview.png)',
          'background-position': 'center',
          'background-size': 'contain',
          'background-repeat': 'no-repeat',
        };
        break;
      case 'sunny':
      case 'clear':
        this.backgroundImage = {
          'background-image': 'url(/assets/images/sunny-removebg-preview.png)',
          'background-position': 'center',
          'background-size': 'contain',
          'background-repeat': 'no-repeat',
        };
        break;
      case 'clouds':
      case 'haze':
        this.backgroundImage = {
          'background-image': 'url(/assets/images/clouds-removebg-preview.png)',
          'background-position': 'center',
          'background-size': 'contain',
          'background-repeat': 'no-repeat',
        };
        break;
      case 'rain':
        this.backgroundImage = {
          'background-image':
            'url(/assets/images/rainy-day-removebg-preview.png)',
          'background-position': 'center',
          'background-size': 'contain',
          'background-repeat': 'no-repeat',
        };
        break;
      case 'drizzle':
        this.backgroundImage = {
          'background-image': 'url(/assets/images/rainy-removebg-preview.png)',
          'background-position': 'center',
          'background-size': 'contain',
          'background-repeat': 'no-repeat',
        };
        break;
      case 'snow':
        this.backgroundImage = {
          'background-image': 'url(/assets/images/snow-removebg-preview.png)',
          'background-position': 'center',
          'background-size': 'contain',
          'background-repeat': 'no-repeat',
        };
        break;
      case 'thunderstorm':
        this.backgroundImage = {
          'background-image':
            'url(/assets/images/thunder-removebg-preview.png)',
          'background-position': 'center',
          'background-size': 'contain',
          'background-repeat': 'no-repeat',
        };
        break;
      default:
        console.log('default');

        // this.backgroundImage = 'assets/weather-backgrounds/default.jpg';
        break;
    }
  }

  getGeoLocation() {
    this.isLoading = true;
    this.weatherService.getCurrentPosition().subscribe({
      next: (position) => {
        console.log(position);

        console.log('Latitude:', position.coords.latitude);
        console.log('Longitude:', position.coords.longitude);
        this.getLocationName(
          position.coords.latitude,
          position.coords.longitude,
        );
      },
      error: (error) => {
        this.isLoading = false;
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

  searchTimeout: any;

  onCitySearch() {
    if (!this.city || this.city.length < 2) {
      this.cityOptions = [];
      return;
    }

    this.weatherService.getCitySuggestions(this.city).subscribe((res: any) => {
      console.log(res, 'rsonopd');
      this.cityOptions = res
        .filter(
          (item: any) =>
            item.name.toLowerCase().startsWith(this.city.toLowerCase()) &&
            item.country === 'IN', // 👈 filter India only
        )
        .map((item: any) => `${item.name}, ${item.state || ''}`);
    });
  }

  onSelectCity(event: any) {
    const selectedCity = event.option.value;
    this.city = selectedCity;
    this.getWeather(selectedCity);
  }

  displayCity(city: any): string {
    return city || '';
  }

  weatherInsight: string = '';
  weatherEmoji: string = '';

  generateInsight(data: any) {
    const temp = data.main.temp;
    const feelsLike = data.main.feels_like; // 👈 ADD HERE
    const humidity = data.main.humidity;
    const weather = data.weather[0].main.toLowerCase();

    if (feelsLike > 38) {
      this.weatherInsight = 'Feels extremely hot. Avoid outdoor activity 🔥';
      this.weatherEmoji = '🥵';
    } else if (temp > 35) {
      this.weatherInsight = 'Very hot outside. Stay hydrated and avoid sun ☀️';
      this.weatherEmoji = '🥵';
    } else if (temp < 15) {
      this.weatherInsight = 'Quite cold. Wear warm clothes 🧥';
      this.weatherEmoji = '🥶';
    } else if (weather.includes('rain')) {
      this.weatherInsight = 'Rain expected. Carry an umbrella 🌧️';
      this.weatherEmoji = '☔';
    } else if (humidity > 80) {
      this.weatherInsight = 'High humidity. It may feel uncomfortable 💧';
      this.weatherEmoji = '💦';
    } else if (weather.includes('cloud')) {
      this.weatherInsight = 'Cloudy weather. Good time for a walk ☁️';
      this.weatherEmoji = '🌥️';
    } else {
      this.weatherInsight = 'Weather looks pleasant. Enjoy your day 🌤️';
      this.weatherEmoji = '😊';
    }
  }

  forecastData: any[] = [];

  getForecast(city: string) {
    this.weatherService.get5DayForecast(city).subscribe((res: any) => {
      this.forecastData = this.processForecast(res.list);
    });
  }

  processForecast(data: any[]) {
    const dailyMap = new Map();

    data.forEach((item: any) => {
      const date = item.dt_txt.split(' ')[0];

      // pick one value per day (noon data preferred)
      if (!dailyMap.has(date) && item.dt_txt.includes('12:00:00')) {
        dailyMap.set(date, item);
      }
    });

    return Array.from(dailyMap.values()).slice(0, 5);
  }

  getWeatherIcon(condition: string): string {
    switch (condition.toLowerCase()) {
      case 'rain':
        return '🌧️';
      case 'clouds':
        return '☁️';
      case 'clear':
        return '☀️';
      case 'snow':
        return '❄️';
      default:
        return '🌤️';
    }
  }
}
