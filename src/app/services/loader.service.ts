import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class LoaderService {
    loader = new Subject<boolean>();
    mainLoader = new Subject<boolean>();
    show() {
        this.loader.next(true);
    }
    hide() {
        this.loader.next(false);
    }

    mainLoadershow() {
        this.mainLoader.next(true);
    }
    mainLoaderhide() {
        this.mainLoader.next(false);
    }
}
