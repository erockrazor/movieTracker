import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the MovieApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.

  **** HERES AN EXAMPLE API CALL WHICH USES MY API KEY ****

  http://www.omdbapi.com/?i=tt3896198&apikey=976955ea
*/
@Injectable()
export class MovieApiProvider {

  apiKey = '976955ea';
  url: any;
  movies: any;

  constructor(public http: HttpClient) {
    console.log('Hello MovieApiProvider Provider');

  }

  movieAutoComplete(movie){
    return new Promise(( resolve ) => {
      let url = 'http://www.omdbapi.com/?s=' + encodeURI(movie) + '&apikey=' + this.apiKey;
      this.http.get(url).subscribe((result) => {
        resolve(result);  
      });
    });
  }

  getMovie(movie) {
    console.log(movie + ' - retrieving movie from API');
    let url = 'http://www.omdbapi.com/?t=' + encodeURI(movie) + '&apikey=' + this.apiKey;
    console.log(url);
    return this.http.get(url);
  }

}
