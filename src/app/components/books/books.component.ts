import { Component, OnInit } from '@angular/core';
import { BooksService } from 'src/app/services/books.service';
import { CharactersService } from 'src/app/services/characters.service';
import { LoaderService } from 'src/app/services/loader.service';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
    fadeOutOnLeaveAnimation()
  ]
})
export class BooksComponent implements OnInit {

  booksArray;

  constructor(
    private booksService: BooksService,
    private charactersService: CharactersService,
    private loaderService: LoaderService,
  ) { }

  ngOnInit() {
    this.loaderService.mainLoadershow();
    if (!localStorage.getItem('books')) {
      this.getBooks();
    } else {
      this.booksArray = JSON.parse(localStorage.getItem('books'));
      this.booksArray = this.booksArray.sort((a, b) => (a.released > b.released ? 1 : -1));
      this.getBookCover();
    }
  }

  getBookCover() {
    this.booksArray.map(async book => {
      const year = new Date(book.released).getFullYear();
      const month = (new Date(book.released).getMonth() + 1);
      const day = new Date(book.released).getDate();
      let dateMonth;
      let dateDay;
      if (month < 10) {
        dateMonth = '0' + month;
      }
      if (day < 10) {
        dateDay = '0' + day;
      }
      book.released = year + '-' + (dateMonth ? dateMonth : month) + '-' + (dateDay ? dateDay : day);
      await this.charactersService.searchPic(book.name).then(result => {
        if (result['data'].result.items.length !== 0) {
          book.cover = result['data'].result.items[0].media;
        }
      }, error => {
        console.log(error);
      });
    });
    this.loaderService.mainLoaderhide();
  }

  async getBooks() {
    await this.booksService.getBooks().then(books => {
      this.booksArray = books;
      localStorage.setItem('books', JSON.stringify(this.booksArray));
      this.booksArray = this.booksArray.sort((a, b) => (a.released > b.released ? 1 : -1));
    });
    await this.getBookCover();
  }
}
