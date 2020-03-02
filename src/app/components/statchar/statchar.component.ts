import { Component, OnInit } from '@angular/core';
import { BooksService } from 'src/app/services/books.service';
import { Label, SingleDataSet } from 'ng2-charts';
import { ChartType, ChartOptions } from 'chart.js';
import { LoaderService } from 'src/app/services/loader.service';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';

@Component({
  selector: 'app-statchar',
  templateUrl: './statchar.component.html',
  styleUrls: ['./statchar.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
    fadeOutOnLeaveAnimation()
  ]
})
export class StatcharComponent implements OnInit {

  booksArray;
  booksForStats = [];
  pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: false
    },
    title: {
      display: true,
      text: 'Number of characters in every book'
    }
  };
  pieChartLabels: Label[] = [];
  pieChartData: SingleDataSet = [];
  pieChartType: ChartType = 'pie';
  pieChartLegend = false;
  pieChartPlugins = [];
  housesForStats = [];
  housesToShowInChart = [];
  pieChartColors = [
    {
      backgroundColor: [],
    },
  ];

  constructor(
    private booksService: BooksService,
    private loaderService: LoaderService
    ) { }

  async ngOnInit() {
    if (!localStorage.getItem('books')) {
      this.loaderService.mainLoadershow();
      await this.getBooks();
    } else {
      this.booksArray = JSON.parse(localStorage.getItem('books'));
    }
    this.booksArray = this.booksArray.sort((a, b) => (a.released > b.released ? 1 : -1));
    this.getStatDataForCharactersInBooks();
  }

  getStatDataForCharactersInBooks() {
    this.booksArray.map(currentBook => {
      const book = {
        name: undefined,
        characterCount: undefined
      };
      book.name = currentBook.name;
      book.characterCount = currentBook.characters.length;
      this.booksForStats.push(book);
      this.pieChartData.push(book.characterCount);
      this.pieChartLabels.push(book.name);
      this.pieChartColors[0].backgroundColor.push(this.fillColors());
    });
    this.loaderService.mainLoaderhide();
  }

  async getBooks() {
    await this.booksService.getBooks().then(books => {
      this.booksArray = books;
      localStorage.setItem('books', JSON.stringify(this.booksArray));
    });
  }

  fillColors() {
    const first = Math.floor(Math.random() * Math.floor(256));
    const second = Math.floor(Math.random() * Math.floor(256));
    const third = Math.floor(Math.random() * Math.floor(256));
    return 'rgba(' + first + ',' + second + ',' + third + ',0.3)';
  }

}
