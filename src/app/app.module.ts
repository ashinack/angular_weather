import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { WeatherCheckPageComponent } from './weather-check-page/weather-check-page.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [AppComponent, WeatherCheckPageComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
  ],
  providers: [provideAnimationsAsync(), DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
