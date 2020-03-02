import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HousesService {

  // url = 'https://cors-anywhere.herokuapp.com/https://anapioficeandfire.com/api/';
  url = 'https://anapioficeandfire.com/api/';

  constructor(
    private http: HttpClient
  ) { }


  getHouses(page) {
    return this.http.get(this.url + 'houses/',
      { params: { pageSize: '50', page } }
    ).toPromise();
  }

}
