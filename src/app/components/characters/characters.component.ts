import { Component, OnInit, ViewChild } from '@angular/core';
import { CharactersService } from 'src/app/services/characters.service';
import { MatDialog } from '@angular/material';
import { CharacterDetailsComponent } from '../../dialogs/characterdetails/characterdetails.component';
import { LoaderService } from 'src/app/services/loader.service';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
    fadeOutOnLeaveAnimation()
  ]
})
export class CharactersComponent implements OnInit {

  charactersArray = [];
  characters = [];
  charactersCopy = [];
  charactersSearchRes = [];
  showCharacters = 100;
  searchInput;

  @ViewChild('scrolldiv', { static: false }) scrolldiv: any;
  constructor(
    private charactersService: CharactersService,
    public dialog: MatDialog,
    private loaderService: LoaderService
  ) {
  }

  ngOnInit() {
    if (!localStorage.getItem('characters')) {
      this.loaderService.mainLoadershow();
      this.getCharacters();
    } else {
      this.charactersCopy = JSON.parse(localStorage.getItem('characters'));
      this.charactersCopy = this.charactersCopy.sort((a, b) => (a.name > b.name ? 1 : -1));
      this.characters = this.charactersCopy.slice(0, this.showCharacters);
    }
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
    this.charactersArray.map(page => {
      page.map(character => {
        this.characters.push(character);
        this.charactersCopy.push(character);
      });
    });
    this.charactersCopy = this.charactersCopy.sort((a, b) => (a.name > b.name ? 1 : -1));
    localStorage.setItem('characters', JSON.stringify(this.charactersCopy));
    this.characters = this.charactersCopy.slice(0, this.showCharacters);
    this.loaderService.mainLoaderhide();
  }

  onItemScroll(event) {
    const viewHeight = event.target.offsetHeight;
    const scrollHeight = event.target.scrollHeight;
    const scrollLocation = event.target.scrollTop;
    const buffer = 200;
    const limit = scrollHeight - viewHeight - buffer;
    if (scrollLocation > limit) {
      this.showCharacters += 100;
      switch (this.charactersSearchRes.length === 0) {
        case true:
          this.characters = this.charactersCopy.slice(0, this.showCharacters);
          break;
        case false:
          this.characters = this.charactersSearchRes.slice(0, this.showCharacters);
          break;
        default:
          break;
      }

    }
  }

  async onSearch() {
    if (this.searchInput && this.searchInput !== '') {
      this.characters = [];
      this.charactersSearchRes = [];
      this.scrolldiv.nativeElement.scrollTop = 0;
      this.charactersCopy.forEach(character => {
        if (character.name.toLowerCase().includes(this.searchInput.toLowerCase())) {
          this.charactersSearchRes.push(character);
        } else if (character.aliases[0] !== '') {
          let characterAdded = false;
          character.aliases.forEach(alias => {
            if (alias.toLowerCase().includes(this.searchInput.toLowerCase())) {
              characterAdded = true;
            }
          });
          if (characterAdded) {
            this.charactersSearchRes.push(character);
          }
        }
      });
      this.showCharacters = 100;
      this.characters = this.charactersSearchRes.slice(0, this.showCharacters);
    } else {
      this.charactersSearchRes = [];
      this.showCharacters = 100;
      this.characters = this.charactersCopy.slice(0, this.showCharacters);
    }
  }

  selectCharacter(character) {
    const idHelper = character.url.split('/');
    const characterId = idHelper[idHelper.length - 1];
    // this.router.navigate(['./', characterId], { relativeTo: this.route });
    const dialogRef = this.dialog.open(CharacterDetailsComponent, {
      panelClass: 'no-padding-dialog',
      width: '750px',
      height: '500px',
      data: {
        characterId
      }
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result === 'Success') {
      }
    });
  }


}
