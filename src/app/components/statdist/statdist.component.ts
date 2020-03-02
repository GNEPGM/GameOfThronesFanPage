import { Component, OnInit, ViewChild } from '@angular/core';
import { HousesService } from 'src/app/services/houses.service';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label } from 'ng2-charts';
import { LoaderService } from 'src/app/services/loader.service';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';

@Component({
  selector: 'app-statdist',
  templateUrl: './statdist.component.html',
  styleUrls: ['./statdist.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
    fadeOutOnLeaveAnimation()
  ]
})
export class StatdistComponent implements OnInit {

  searchInput;
  barChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: false
    },
    title: {
      display: true,
      text: 'Character distribution across houses'
    }
  };
  barChartLabels: Label[] = [];
  barChartData: SingleDataSet = [];
  barChartType: ChartType = 'bar';
  barChartLegend = false;
  barChartPlugins = [];
  housesForStats = [];
  housesForStatsCopy = [];
  houseSearchRes = [];
  housesToShowInChart = [];
  barChartColors = [
    {
      backgroundColor: [],
    },
  ];
  housesArray = [];
  showHouses = 100;
  houses = [];

  @ViewChild('scrolldiv', { static: false }) scrolldiv: any;
  constructor(
    private housesService: HousesService,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    if (!localStorage.getItem('houses')) {
      this.loaderService.mainLoadershow();
      this.getHouses();
    } else {
      this.houses = JSON.parse(localStorage.getItem('houses'));
    }
    this.getStatDataForCharacterDistribution();
  }

  async getHouses() {
    for (let index = 1; index <= 9; index++) {
      await this.housesService.getHouses(index).then(house => {
        this.housesArray.push(house);
      });
    }
    await this.mergeHouses();
  }

  mergeHouses() {
    this.housesArray.map(page => {
      page.map(house => {
        house.checked = false;
        this.houses.push(house);
      });
    });
    this.houses = this.houses.sort((a, b) => (a.name > b.name ? 1 : -1));
    localStorage.setItem('houses', JSON.stringify(this.houses));
    this.getStatDataForCharacterDistribution();
  }

  getStatDataForCharacterDistribution() {
    this.loaderService.mainLoadershow();
    this.houses.map(currentHouse => {
      const house = {
        name: undefined,
        memberCount: undefined,
        checked: false
      };
      house.name = currentHouse.name;
      house.memberCount = currentHouse.swornMembers.length;
      house.checked = currentHouse.checked;
      this.housesForStatsCopy.push(house);
      this.barChartColors[0].backgroundColor.push(this.fillColors());
    });
    this.housesForStats = this.housesForStatsCopy.slice(0, this.showHouses);
    this.loaderService.mainLoaderhide();
  }

  houseChecked(event, house) {
    if (event.checked === true) {
      this.housesToShowInChart.push(house);
    } else {
      this.housesToShowInChart.splice(this.housesToShowInChart.indexOf(house), 1);
    }
    this.barChartLabels = [];
    this.barChartData = [];
    this.housesToShowInChart.forEach(currentHouse => {
      this.barChartLabels.push(currentHouse.name);
      this.barChartData.push(currentHouse.memberCount);
    });
  }

  fillColors() {
    const first = Math.floor(Math.random() * Math.floor(256));
    const second = Math.floor(Math.random() * Math.floor(256));
    const third = Math.floor(Math.random() * Math.floor(256));
    return 'rgba(' + first + ',' + second + ',' + third + ',0.3)';
  }

  async onSearch() {
    if (this.searchInput && this.searchInput !== '') {
      this.housesForStats = [];
      this.houseSearchRes = [];
      this.scrolldiv.nativeElement.scrollTop = 0;
      this.housesForStatsCopy.forEach(house => {
        if (house.name.toLowerCase().includes(this.searchInput.toLowerCase())) {
          this.houseSearchRes.push(house);
        }
      });
      this.showHouses = 100;
      this.housesForStats = this.houseSearchRes.slice(0, this.showHouses);
    } else {
      this.houseSearchRes = [];
      this.showHouses = 100;
      this.housesForStats = this.housesForStatsCopy.slice(0, this.showHouses);
    }
  }

  onItemScroll(event) {
    const viewHeight = event.target.offsetHeight;
    const scrollHeight = event.target.scrollHeight;
    const scrollLocation = event.target.scrollTop;
    const buffer = 200;
    const limit = scrollHeight - viewHeight - buffer;
    if (scrollLocation > limit) {
      this.showHouses += 100;
      switch (this.houseSearchRes.length === 0) {
        case true:
          this.housesForStats = this.housesForStatsCopy.slice(0, this.showHouses);
          break;
        case false:
          this.housesForStats = this.houseSearchRes.slice(0, this.showHouses);
          break;
        default:
          break;
      }
    }
  }

}
