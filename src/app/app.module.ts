import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './app-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BooksComponent } from './components/books/books.component';
import { CharactersComponent } from './components/characters/characters.component';
import { CharacterDetailsComponent } from './dialogs/characterdetails/characterdetails.component';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { StatcharComponent } from './components/statchar/statchar.component';
import { StatdeadComponent } from './components/statdead/statdead.component';
import { StatdistComponent } from './components/statdist/statdist.component';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
import { LoaderComponent } from './components/loader/loader.component';
import { LoaderService } from './services/loader.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BooksComponent,
    CharactersComponent,
    CharacterDetailsComponent,
    StatcharComponent,
    StatdeadComponent,
    StatdistComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FlexLayoutModule,
    ChartsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    LoaderService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
