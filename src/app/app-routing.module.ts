import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BooksComponent } from './components/books/books.component';
import { CharactersComponent } from './components/characters/characters.component';
import { CharacterDetailsComponent } from './dialogs/characterdetails/characterdetails.component';
import { StatdistComponent } from './components/statdist/statdist.component';
import { StatcharComponent } from './components/statchar/statchar.component';
import { StatdeadComponent } from './components/statdead/statdead.component';


const routes: Routes = [
  // { path: 'home', component: HomeComponent },
  {
    path: 'home',
    children: [
      { path: '', component: HomeComponent },
      { path: 'statchar', component: StatcharComponent },
      { path: 'statdist', component: StatdistComponent },
      { path: 'statdead', component: StatdeadComponent }
    ]
  },
  { path: 'books', component: BooksComponent },
  {
    path: 'characters',
    children: [
      { path: '', component: CharactersComponent },
      { path: ':id', component: CharacterDetailsComponent }
    ]
  },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
