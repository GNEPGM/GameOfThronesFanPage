import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharactersService } from 'src/app/services/characters.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { BooksService } from 'src/app/services/books.service';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';

@Component({
  selector: 'app-characterdetails',
  templateUrl: './characterdetails.component.html',
  styleUrls: ['./characterdetails.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
    fadeOutOnLeaveAnimation()
  ]
})
export class CharacterDetailsComponent implements OnInit {

  characterId;
  character;
  url = 'https://cdn4.iconfinder.com/data/icons/political-elections/50/48-512.png';

  constructor(
    @Inject(MAT_DIALOG_DATA) public charId: any,
    private charactersService: CharactersService,
    private booksService: BooksService,
  ) {
  }

  async getData() {
    this.characterId = this.charId.characterId;
    await this.charactersService.getCharacter(this.characterId).then(character => {
      this.character = character;
      this.getCharacterByUrl(this.character.father).then(name => {
        if (name) {
          this.character.father = name;
        }
      });
      this.getCharacterByUrl(this.character.mother).then(name => {
        if (name) {
          this.character.mother = name;
        }
      });
      this.getCharacterByUrl(this.character.spouse).then(name => {
        if (name) {
          this.character.spouse = name;
        }
      });
      const booksWithNames = [];
      this.character.books.map(book => {
        if (book) {
          this.getBookNameByUrl(book).then(bookName => {
            booksWithNames.push(bookName);
          });
        }
      });
      this.character.books = booksWithNames;
      const povBooksWithNames = [];
      this.character.povBooks.map(book => {
        if (book) {
          this.getBookNameByUrl(book).then(bookName => {
            povBooksWithNames.push(bookName);
          });
        }
      });
      this.character.povBooks = booksWithNames;
    });
    await this.charactersService.searchPic(this.character.name ? this.character.name : this.character.aliases[0]).then(data => {
      if (data['data'].result.items.length !== 0) {
        this.url = data['data'].result.items[0].media;
      } else {
        this.noPicture();
      }
    }, error => {
      this.noPicture();
    });

  }

  noPicture() {
    switch (this.character.gender) {
      case 'Male':
        this.url = 'https://cdn4.iconfinder.com/data/icons/political-elections/50/48-512.png';
        break;
      case 'Female':
        this.url = 'https://stanfordflipside.com/images/132fakeGirlfriend.jpg';
        break;
      default:
        break;
    }
  }

  async getCharacterByUrl(urlToExtract) {
    let idHelper;
    let result;
    try {
      idHelper = urlToExtract.url.split('/');
      idHelper = idHelper[idHelper.length - 1];
    } catch (error) {
      idHelper = urlToExtract.split('/');
      idHelper = idHelper[idHelper.length - 1];
    }
    await this.charactersService.getCharacter(idHelper).then(character => {
      result = character['name'];
    });
    return result;
  }

  async getBookNameByUrl(urlToExtract) {
    let idHelper;
    let result;
    try {
      idHelper = urlToExtract.url.split('/');
      idHelper = idHelper[idHelper.length - 1];
    } catch (error) {
      idHelper = urlToExtract.split('/');
      idHelper = idHelper[idHelper.length - 1];
    }
    await this.booksService.getBook(idHelper).then(book => {
      result = book['name'];
    });
    return result;
  }

  ngOnInit() {
    this.getData();
  }

}
