import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {

  // url = 'https://cors-anywhere.herokuapp.com/https://anapioficeandfire.com/api/';
  url = 'https://anapioficeandfire.com/api/';

  constructor(
    private http: HttpClient
  ) { }

  // 42 * 50 + 34 = 2138 karakter van
  getCharacters(page) {
    return this.http.get(this.url + 'characters/',
      { params: { pageSize: '50', page } }
    ).toPromise();
  }

  getCharacter(characterId) {
    return this.http.get(this.url + 'characters/' + characterId
    ).toPromise();
  }

  searchPic(nameOrAlias) {
      // return this.http.get('https://cors-anywhere.herokuapp.com/https://api.qwant.com/api/search/images',
      // return this.http.get('https://api.qwant.com/api/search/images',
      return this.http.get('/api',
      {
        params: {
          count: '1',
          q: 'Game of Thrones ' + nameOrAlias,
          t: 'images',
          safesearch: '1',
          locale: 'en_US',
          uiv: '4'
        }
      }).toPromise();
  }

}
