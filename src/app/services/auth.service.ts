import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Platform, AlertController } from '@ionic/angular';
import { tap, catchError } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token: any;

  url = 'http://18.140.90.194:8001';
  urlToken = 'http://18.140.90.194:8001/tokenInfo';
  user = null;
  authenticationState = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private helper: JwtHelperService,
    private storage: Storage,
    private platform: Platform,
    private alertCtrl: AlertController
  ) {
    this.platform.ready().then(() => {
      this.checkToken();
    });
  }


  checkToken() {
    this.storage.get(this.token).then(token => {
      if (token) {
        const decoded = this.helper.decodeToken(token);
        const isExpired = this.helper.isTokenExpired(token);

        if (!isExpired) {
          this.user = decoded;
          this.authenticationState.next(true);
        } else {
          this.storage.remove(this.token);
        }
      }
    });
  }

  login(credentials) {
    const requestBody: FormData = new FormData();
    requestBody.append('email', credentials.datas.email);
    requestBody.append('password', credentials.datas.password);
    return this.http.post(this.url + '/signin', requestBody).pipe(
      tap(response => {
        this.storage.set('token', response['token']);
        this.user = this.helper.decodeToken(response['token']);
        this.authenticationState.next(true);
        console.log(response['token']);

        this.storage.get('token').then((val) => {
          console.log('Tokennya: ', val);
        });

      }),
      catchError(error => {
        this.showAlert(error.error.msg);
        throw new Error(error);
      })
    );
  }


  getInfo() {
    const headers = new HttpHeaders({
      'Authorization' : this.token['token']
    });

    return this.http.get(this.url + '/tokenInfo', { headers: headers})
    .pipe(
      tap(data => {
        return data;
      })
    )
  }

  logout() {
    this.storage.remove('token').then(() => {
      this.authenticationState.next(false);
    });
  }




  isAuthenticated() {
    return this.authenticationState.value;
  }

  showAlert(msg) {
    const alert = this.alertCtrl.create({
      message: msg,
      header: 'Error',
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }
}
