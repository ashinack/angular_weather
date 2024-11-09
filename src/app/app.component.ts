import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-weather-app';
  theme:any='light';
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
     this.theme = JSON.parse(localStorage.getItem('theme') || '"light"');
    //  JSON.parse(this.theme)
     console.log( this.theme,"storedTheme");
    this.renderer.addClass(this.document.body, this.theme);
  }
}
