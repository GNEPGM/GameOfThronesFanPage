import { Component, OnInit } from '@angular/core';
import { HousesService } from 'src/app/services/houses.service';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { CharactersService } from 'src/app/services/characters.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
    fadeOutOnLeaveAnimation()
  ]
})
export class HomeComponent implements OnInit {
  url;
  housesArray = [];
  houses = [];
  regions = [];
  selectedRegion;
  randomHouseInSelectedRegion;

  constructor(
    private housesService: HousesService,
    private charactersService: CharactersService,
    private loaderService: LoaderService
  ) {
  }

  ngOnInit() {
    if (!localStorage.getItem('houses')) {
      this.loaderService.mainLoadershow();
      this.getHouses();
    } else {
      this.houses = JSON.parse(localStorage.getItem('houses'));
    }
    if (!localStorage.getItem('regions')) {
      this.loaderService.mainLoadershow();
      this.getRegions();
    } else {
      this.regions = JSON.parse(localStorage.getItem('regions'));
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
    this.housesArray.forEach(page => {
      page.forEach(character => {
        this.houses.push(character);
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
    this.loaderService.mainLoaderhide();
  }

  mouseHover(selectedRegion) {
    this.mouseHoverLeave();
    this.regions.map(region => {
      if (region.toLowerCase().includes(selectedRegion.toLowerCase())) {
        this.selectedRegion = region;
      }
    });
    const housesInSelectedRegion = [];
    this.houses.map(house => {
      if (house.region === this.selectedRegion) {
        housesInSelectedRegion.push(house);
      }
    });
    this.randomHouseInSelectedRegion = housesInSelectedRegion[Math.floor(Math.random() * housesInSelectedRegion.length)];
    if (this.randomHouseInSelectedRegion.currentLord !== '') {
      this.getCharacterByUrl(this.randomHouseInSelectedRegion.currentLord).then(name => {
        if (this.randomHouseInSelectedRegion) {
          this.randomHouseInSelectedRegion.currentLord = name;
        }
      });
    }
    if (this.randomHouseInSelectedRegion.overlord !== '') {
      this.getCharacterByUrl(this.randomHouseInSelectedRegion.overlord).then(name => {
        if (this.randomHouseInSelectedRegion) {
          this.randomHouseInSelectedRegion.overlord = name;
        }
      });
    }
    if (this.randomHouseInSelectedRegion.heir !== '') {
      this.getCharacterByUrl(this.randomHouseInSelectedRegion.heir).then(name => {
        if (this.randomHouseInSelectedRegion) {
          this.randomHouseInSelectedRegion.heir = name;
        }
      });
    }
    if (this.randomHouseInSelectedRegion.founder !== '') {
      this.getCharacterByUrl(this.randomHouseInSelectedRegion.founder).then(name => {
        if (this.randomHouseInSelectedRegion) {
          this.randomHouseInSelectedRegion.founder = name;
        }
      });
    }
    if (selectedRegion !== 'The Neck') {
      this.url = '../../../assets/images/' + selectedRegion + '.png';
    } else {
      this.url = '../../../assets/images/The North.png';
    }
    // switch (selectedRegion) {
    //   case 'Beyond the Wall':
    //     break;
    //   case 'The North':
    //     break;
    //   case 'The Neck':
    //     break;
    //   case 'The Vale':
    //     break;
    //   case 'The Riverlands':
    //     break;
    //   case 'The Westerlands':
    //     break;
    //   case 'Iron Islands':
    //     break;
    //   case 'The Reach':
    //     break;
    //   case 'The Crownlands':
    //     break;
    //   case 'Dorne':
    //     break;
    //   case 'The Stormlands':
    //     break;
    //   default:
    //     this.url = undefined;
    //     break;
    // }
  }

  async getCharacterByUrl(urlToExtract) {
    let idHelper;
    let result;
    let firstSeg;
    try {
      idHelper = urlToExtract.url.split('/');
      firstSeg = idHelper[0];
      idHelper = idHelper[idHelper.length - 1];
    } catch (error) {
      idHelper = urlToExtract.split('/');
      firstSeg = idHelper[0];
      idHelper = idHelper[idHelper.length - 1];
    }
    switch (firstSeg) {
      case 'https:':
        await this.charactersService.getCharacter(idHelper).then(character => {
          result = character['name'];
        });
        break;
      default:
        result = urlToExtract;
        break;
    }
    return result;
  }

  mouseHoverLeave() {
    this.selectedRegion = undefined;
    this.randomHouseInSelectedRegion = undefined;
    this.url = undefined;
  }
}
