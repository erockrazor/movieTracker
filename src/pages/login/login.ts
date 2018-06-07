import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { HomePage } from '../home/Home';
import { ViewChild } from '@angular/core/src/metadata/di';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  acc:any = {};
  user:any; 

  constructor(public navCtrl: NavController, public navParams: NavParams, public alert: AlertController, public auth: AngularFireAuth, public db:AngularFireDatabase) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  createAccount(){
    this.auth.auth
      .createUserWithEmailAndPassword(this.acc.email,this.acc.password)
      .then(res => {
        this.db.database.app.auth().currentUser.updateProfile({
                  displayName: this.acc.displayName,
                  photoURL: null
              });
        console.log(res)
      })
      .catch(res => {
        console.log(res)
        this.alert.create({
          title: 'Couldn\'t Create Account!',
          message: res.message,
          buttons: [
            { text: 'Okay', handler: () => { } }
          ]
        }).present();
      });
  }

  login(){
    this.auth.auth
      .signInWithEmailAndPassword(this.acc.email,this.acc.password)
      .then(res => {
        console.log(res);
        console.log(res.uid);
        this.navCtrl.setRoot(HomePage,{
          user: res.uid
        })
      })
      .catch(res => {
        console.log(res)
        this.alert.create({
            title: 'Couldn\'t Log In!',
            message: res.message,
            buttons: [
              { text: 'Okay', handler: () => {   } }
            ]
          }).present();
          
      });
  }
}
