import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { LoginPage } from '../login/login'
import { MovieApiProvider } from '../../providers/movie-api/movie-api';
import { AlertController } from 'ionic-angular';
import { Observable } from 'rxjs';



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
imdbSvg: any = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 1000 1000"enable-background="new 0 0 1000 1000" xml:space="preserve"><g><g transform="translate(0.000000,268.000000) scale(0.100000,-0.100000)"><path d="M100-2290.2v-2007.5h521h521v2007.5v2007.5H621H100V-2290.2z" /><path d="M1433.2-2290.2v-2007.5H1893h459.7l1.5,1291.9c1.5,709.5,4.6,1279.6,7.7,1267.3c3.1-12.3,85.8-577.7,182.4-1256.6c96.5-678.9,179.3-1248.9,183.9-1267.3c7.7-35.2,9.2-35.2,329.5-35.2c320.3,0,321.8,0,327.9,35.2c4.6,18.4,53.6,372.4,108.8,784.6c53.6,413.8,131.8,996.1,171.6,1294.9l73.6,544l4.6-1330.2l3.1-1328.6l456.7,3.1l455.1,4.6v1999.8v1999.8l-677.3,4.6l-678.9,3.1l-7.7-33.7c-3.1-19.9-55.2-421.4-114.9-893.4c-130.3-1028.3-114.9-925.6-125.7-896.5c-6.1,12.3-65.9,423-134.9,911.8S2791-301.1,2786.4-293.5c-3.1,6.1-309.6,10.7-680.4,10.7h-672.7V-2290.2z"/><path d="M4957.9-2291.8v-2009l870.4,7.7c752.4,4.6,884.2,9.2,983.8,32.2c294.2,67.4,455.1,214.5,519.5,473.5c30.7,128.7,47.5,586.9,46,1397.6c0,876.6-16.9,1365.4-52.1,1498.7c-82.8,314.2-315.7,502.6-694.2,560.9c-196.2,30.6-600.7,47.5-1140.1,47.5h-533.3V-2291.8z M6231.3-1012.2c96.6-49,95-42.9,102.7-1032.9c6.1-934.8-7.7-1347-47.5-1445.1c-29.1-65.9-91.9-102.7-203.8-113.4l-82.8-9.2v1322.5v1322.5l92-9.2C6142.4-983.1,6205.3-998.4,6231.3-1012.2z"/><path d="M7609-2290.2v-2007.5h467.4h465.9l16.9,61.3c7.7,33.7,23,90.4,32.2,124.1l16.9,64.4l44.4-55.2c58.3-70.5,229.9-183.9,327.9-217.6c240.6-81.2,528.7-24.5,715.7,144.1c93.5,84.3,141,165.5,176.2,300.4c26.1,98.1,27.6,203.8,27.6,1294.9v1187.6l-41.4,88.9c-84.3,179.3-202.3,277.4-395.4,326.4c-134.9,33.7-349.4,33.7-472-1.5c-102.7-29.1-236-107.3-323.3-188.5c-27.6-27.6-53.6-49-56.7-49c-3.1,0-6.1,210-6.1,467.4v467.4h-498h-498V-2290.2z M8810.4-1545.5c91.9-38.3,91.9-33.7,98.1-997.6c3.1-491.9-1.5-936.3-9.2-1019.1c-13.8-128.7-19.9-148.6-55.2-179.3c-52.1-44.4-119.5-44.4-170.1,0c-65.9,56.7-70.5,151.7-65.9,1169.2c4.6,1009.9,4.6,1000.7,87.3,1031.3C8750.7-1520.9,8752.2-1520.9,8810.4-1545.5z"/></g></g></svg>`;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AngularFireAuth, private movieApi: MovieApiProvider, private alertCtrl: AlertController, private db:AngularFireDatabase) {
    
  }

  ionViewDidLoad(){
    this.userId = this.navParams.get('user');
    console.log(this.userId);
    this.loadMoviesToSeeList();
  }

  loadMoviesToSeeList(){
    console.log('loading the movie to see list');
    this.db.list(this.userId + '/movies/').valueChanges().subscribe( data => {
      console.log(data);
      this.movieList = data;
      console.log(this.movieList);
    });
  }

  saveMoviesToSeeList(movie){
    console.log('saving the movie to see list');
    this.db.object(this.userId + '/movies/' +this.movieDetails.Title).set(this.movieDetails);
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
