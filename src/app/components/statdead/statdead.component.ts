import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { BooksService } from 'src/app/services/books.service';
import { CharactersService } from 'src/app/services/characters.service';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { HousesService } from 'src/app/services/houses.service';

@Component({
  selector: 'app-statdead',
  templateUrl: './statdead.component.html',
  styleUrls: ['./statdead.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
    fadeOutOnLeaveAnimation()
  ]
})
export class StatdeadComponent implements OnInit {
  isLoading;
  selectedOption = 'books';
  charactersArray = [];
  regions = [];
  booksArray;
  houses = [];
  regionsForStats = [];
  housesArray = [];
  booksForStats = [];
  lineChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    legend: {
      display: true
    },
    title: {
      display: true,
      text: 'Dead / Alive statistics by books'
    }
  };
  lineChartLabels: Label[] = [];
  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Dead characters' },
    { data: [], label: 'Alive characters' }
  ];
  lineChartType: ChartType = 'line';
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartColors = [
    {
      backgroundColor: [],
    },
  ];

  constructor(
    private charactersService: CharactersService,
    private booksService: BooksService,
    private housesService: HousesService
  ) {
    this.isLoading = true;
  }

  async ngOnInit() {
    if (!localStorage.getItem('books')) {
      await this.getBooks();
    } else {
      this.booksArray = JSON.parse(localStorage.getItem('books'));
    }
    if (!localStorage.getItem('characters')) {
      await this.getCharacters();
    } else {
      this.charactersArray = JSON.parse(localStorage.getItem('characters'));
      this.charactersArray = this.charactersArray.sort((a, b) => (a.name > b.name ? 1 : -1));
    }
    this.booksArray = this.booksArray.sort((a, b) => (a.released > b.released ? 1 : -1));
    if (!localStorage.getItem('DeadAliveStatsByBooks')) {
      setTimeout(() => {
        this.getStatDataForDeadAliveInBooks();
      }, 200);
    } else {
      this.booksForStats = JSON.parse(localStorage.getItem('DeadAliveStatsByBooks'));
      this.booksArray.map(() => {
        this.lineChartColors[0].backgroundColor.push(this.fillColors());
      });
      this.booksForStats.map(book => {
        this.lineChartLabels.push(book.name);
        this.lineChartData[0].data.push(book.dead);
        this.lineChartData[1].data.push(book.alive);
      });
      this.isLoading = false;
    }
    if (!localStorage.getItem('houses')) {
      await this.getHouses();
    } else {
      this.houses = JSON.parse(localStorage.getItem('houses'));
    }
    if (!localStorage.getItem('regions')) {
      await this.getRegions();
    } else {
      this.regions = [];
      JSON.parse(localStorage.getItem('regions')).map(region => {
        this.regions.push({
          name: region,
          characters: [],
          dead: 0,
          alive: 0
        });
      });
    }
    if (!localStorage.getItem('DeadAliveStatsByRegions')) {
      setTimeout(() => {
        this.getDataByRegions();
      }, 300);
    } else {
      this.regionsForStats = JSON.parse(localStorage.getItem('DeadAliveStatsByRegions'));
      this.isLoading = false;
    }
  }

  async getHouses() {
    for (let index = 1; index <= 9; index++) {
      await this.housesService.getHouses(index).then(house => {
        this.housesArray.push(house);
      });
    }
    this.mergeHouses();
  }

  mergeHouses() {
    this.housesArray.map(page => {
      page.map(house => {
        this.houses.push(house);
      });
    });
    this.houses = this.houses.sort((a, b) => (a.name > b.name ? 1 : -1));
    localStorage.setItem('houses', JSON.stringify(this.houses));
    this.getRegions();
  }

  getRegions() {
    this.houses.map(house => {
      if (!this.regions.includes(house.region) && house.region !== '' && house.region !== 'None') {
        this.regions.push(house.region);
      }
    });
    localStorage.setItem('regions', JSON.stringify(this.regions));
  }

  async getCharacters() {
    for (let index = 1; index <= 43; index++) {
      await this.charactersService.getCharacters(index).then(characters => {
        this.charactersArray.push(characters);
      });
    }
    this.mergeCharacters();
  }

  mergeCharacters() {
    const tempCharArr = [];
    this.charactersArray.map(page => {
      page.map(character => {
        tempCharArr.push(character);
      });
    });
    this.charactersArray = tempCharArr.sort((a, b) => (a.name > b.name ? 1 : -1));
    localStorage.setItem('characters', JSON.stringify(this.charactersArray));
  }


  getStatDataForDeadAliveInBooks() {
    this.booksArray.map(currentBook => {
      const book = {
        name: undefined,
        dead: 0,
        alive: 0,
        id: undefined
      };
      book.name = currentBook.name;
      book.id = this.getId(currentBook);
      this.booksForStats.push(book);
      this.lineChartColors[0].backgroundColor.push(this.fillColors());
    });
    this.charactersArray.map(currentCharacter => {
      switch (currentCharacter.died) {
        case '':
          this.booksForStats.map(book => {
            currentCharacter.books.map(characterInBook => {
              if (this.getId(characterInBook) === book.id) {
                book.dead += 1;
              }
            });
          });
          break;
        default:
          this.booksForStats.map(book => {
            currentCharacter.books.map(characterInBook => {
              if (this.getId(characterInBook) === book.id) {
                book.alive += 1;
              }
            });
          });
          break;
      }
    });
    this.booksForStats.map(book => {
      this.lineChartLabels.push(book.name);
      this.lineChartData[0].data.push(book.dead);
      this.lineChartData[1].data.push(book.alive);
    });
    localStorage.setItem('DeadAliveStatsByBooks', JSON.stringify(this.booksForStats));
    this.isLoading = false;
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

  getId(book) {
    try {
      const idHelper = book.url.split('/');
      return idHelper[idHelper.length - 1];
    } catch (error) {
      const idHelper = book.split('/');
      return idHelper[idHelper.length - 1];
    }
  }

  getDataByRegions() {
    const tempRegionArr = this.regions;
    this.houses.map(house => {
      tempRegionArr.map(region => {
        if (house.region === region.name && house.swornMembers.length !== 0) {
          region.characters.push(house.swornMembers);
        }
      });
    });
    this.extractCharactersArrayFromRegion();
    tempRegionArr.map(region => {
      this.charactersArray.map(character => {
        if (region.characters[0].includes(this.getId(character.url))) {
          switch (character.died) {
            case '':
              region.alive += 1;
              break;
            default:
              region.dead += 1;
              break;
          }
        }
      });
    });
    this.regionsForStats = tempRegionArr;
    localStorage.setItem('DeadAliveStatsByRegions', JSON.stringify(this.regionsForStats));
  }

  extractCharactersArrayFromRegion() {
    this.regions.map(region => {
      const characterIdInRegion = [];
      region.characters.map(characterArray => {
        characterArray.map(character => {
          characterIdInRegion.push(this.getId(character));
        });
      });
      region.characters = [characterIdInRegion];
    });
  }

  selection(event) {
    this.lineChartLabels = [];
    this.lineChartData = [
      { data: [], label: 'Dead characters' },
      { data: [], label: 'Alive characters' }
    ];
    this.selectedOption = event.value;
    switch (this.selectedOption) {
      case 'books':
        this.lineChartOptions = {
          responsive: true,
          scales: { xAxes: [{}], yAxes: [{}] },
          legend: {
            display: true
          },
          title: {
            display: true,
            text: 'Dead / Alive statistics by books'
          }
        };
        this.booksArray.map(() => {
          this.lineChartColors[0].backgroundColor.push(this.fillColors());
        });
        this.booksForStats.map(book => {
          this.lineChartLabels.push(book.name);
          this.lineChartData[0].data.push(book.dead);
          this.lineChartData[1].data.push(book.alive);
        });
        break;
      case 'regions':
        this.lineChartOptions = {
          responsive: true,
          scales: { xAxes: [{}], yAxes: [{}] },
          legend: {
            display: true
          },
          title: {
            display: true,
            text: 'Dead / Alive statistics by regions'
          }
        };
        this.regions.map(() => {
          this.lineChartColors[0].backgroundColor.push(this.fillColors());
        });
        this.regionsForStats.map(region => {
          this.lineChartLabels.push(region.name);
          this.lineChartData[0].data.push(region.dead);
          this.lineChartData[1].data.push(region.alive);
        });
        break;
      default:
        break;
    }
  }

}
