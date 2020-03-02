import { Component, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { LoaderService } from './services/loader.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(MatMenuTrigger, { static: true }) trigger: MatMenuTrigger;
  isLoading = false;
  timeout;
  loader: Subject<boolean> = this.loaderService.loader;


  constructor(
    private loaderService: LoaderService
  ) {
    this.loader.subscribe(loading => {
      setTimeout(() => {
        this.isLoading = loading;
      }, 0);
    });
  }

  showMenu() {
    clearTimeout(this.timeout);
    this.trigger.openMenu();
  }

  hideMenu() {
    this.timeout = setTimeout(() => {
      this.trigger.closeMenu();
    }, 150);

  }
}
