import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  loader: Subject<boolean> = this.loaderService.loader;
  isLoading;

  constructor(private loaderService: LoaderService) {
    this.loader.subscribe(loading => {
      this.isLoading = !loading;
    });
  }

}
