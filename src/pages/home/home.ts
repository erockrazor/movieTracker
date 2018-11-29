import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { MovieApiProvider } from '../../providers/movie-api/movie-api';
import { AlertController } from 'ionic-angular';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
userId: any;
movie: string;
movieQuery: any;
movieList: any;
movieDetails: any;
movies: any; 
autoCompleteList: any;



constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AngularFireAuth, private movieApi: MovieApiProvider, private alertCtrl: AlertController, private db:AngularFireDatabase) {
    
  }

  ionViewDidLoad(){
    this.userId = this.navParams.get('user');
    console.log(this.userId);
    this.loadMoviesToSeeList();
  }

  deleteMovieFromSeeList(movie){
    console.log(movie);
    this.db.object(this.userId + '/movies/' + movie).remove();
  }

  loadMoviesToSeeList(){
    console.log('loading the movie to see list');
    this.db.list(this.userId + '/movies/').valueChanges().subscribe( data => {
      console.log(data);
      this.movieList = data;
      console.log(this.movieList);
    });
    console.log('about to search for autocomplete');
    this.movieApi.movieAutoComplete('help');
  }

  saveMoviesToSeeList(movie){
    console.log('saving the movie to see list');
    this.db.object(this.userId + '/movies/' +this.movieDetails.Title).set(this.movieDetails);
  }

  searchForAutoComplete(){
    if (this.movie.length > 3) {   
    this.movieApi.movieAutoComplete(this.movie)
        .subscribe(movieResponse => {
          console.log(movieResponse);
          this.movies = movieResponse;
          console.log(this.movies);
          if(this.movies.Response = 'True'){
            for (let i = 0; i < this.movies.Search.length; i++) {
              this.autoCompleteList[i] = this.movies.Search[i].Title;
              console.log(this.movies.Search[i].Title);
            }
          }
          console.log(this.autoCompleteList);   
        });
    }
  }

  searchForMovie(){
    let movie: any;
    this.movieApi.getMovie(this.movie)
      .subscribe(movieResponse => {
        console.log(movieResponse);
        movie = movieResponse;
        if (movie != null && movie != undefined) {
          let alert = this.alertCtrl.create({
            title: movie.Title + ' (' + movie.Year + ')',
            subTitle: 'Directed by ' + movie.Director,
            message: movie.Plot,
            buttons: [
              {
                text: 'Search Again',
                handler: () => {
                  console.log('search again clicked');
                  this.movie = "";
                }
              },
              {
                text: 'Add Movie',
                handler: () => {

                  this.movieDetails = movie;
                  console.log('Add To See List');
                  this.saveMoviesToSeeList(movie.Title);
                }
              }
            ]
          });
          alert.present();
        }
      })

  }

}
