import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  // url = 'https://cors-anywhere.herokuapp.com/https://anapioficeandfire.com/api/';
  url = 'https://anapioficeandfire.com/api/';

  constructor(
    private http: HttpClient
  ) { }

  getBooks() {
    return this.http.get(this.url + 'books/?pageSize=50'
    ).toPromise();
  }

  getBook(id) {
    return this.http.get(this.url + 'books/' + id
    ).toPromise();
  }

}
