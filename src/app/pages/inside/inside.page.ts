import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-inside',
  templateUrl: './inside.page.html',
  styleUrls: ['./inside.page.scss'],
})
export class InsidePage implements OnInit {

  data = '';
  urlToken ='http://18.140.90.194:8001/tokenInfo';

  constructor(
    private authService: AuthService,
    private storage: Storage,
    public toastController: ToastController
  ) { }

  ngOnInit() {
  }

  loadData() {
    this.authService.getInfo().subscribe(res => {
      // this.data = res[0];
      console.log(res);
    });

  }



  logout() {
    this.authService.logout();
  }

  clearToken() {
    this.storage.remove('token');

    const toast = this.toastController.create({
      message: 'JWT removed',
      duration: 3000
    });

    toast.then(toast => toast.present());
  }

}
