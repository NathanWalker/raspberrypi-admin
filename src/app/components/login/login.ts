import {Component} from 'angular2/core';
import {Footer} from '../footer/footer';
import {Router} from 'angular2/router';
import {Auth} from '../../services/auth/auth';
import {User} from '../../models/user';


@Component({
  selector: 'login',
  templateUrl: 'app/components/login/login.html',
  styleUrls: ['app/components/login/login.css'],
  providers: [Auth],
  directives: [Footer],
  pipes: []
})
export class Login {
  user: User;
  loading: boolean = false;
  invalidCredentials: boolean = false;

  constructor(public auth: Auth, public router: Router) {
    this.user = new User();

    if (this.auth.isLoggedIn()) {
      this.router.navigate(['Home']);
    }
  }

  login(): void {
    this.loading = true;
    this.invalidCredentials = false;

    this.auth.login(this.user).then(res => {
      this.loading = false;
      if (res) {
        this.router.navigate(['Home']);
      }
    }, () => {
      this.loading = false;
      this.invalidCredentials = true;
    });
  }

  formValid(): boolean {
    return !!this.user.username.length && !!this.user.password.length;
  }

  closeMessage(): void {
    this.invalidCredentials = false;
  }

}
