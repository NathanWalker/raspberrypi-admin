import {Injectable} from 'angular2/core';
import {Router} from 'angular2/router';
import {Http} from 'angular2/http';
import {Config} from '../config/config';
import {JwtHelper} from 'ng2-jwt';
import {User} from '../../models/user';
import 'rxjs/add/operator/map';

@Injectable()
export class Auth {
  loggedIn: boolean;
  jwtHelper: JwtHelper = new JwtHelper();
  url: string;
  user: User;

  constructor(public config: Config, public http: Http, public router: Router) {
    if (localStorage.getItem('PI_id_token')) {
      this.user = new User(JSON.parse(localStorage.getItem('PI_profile')));
    }

    if (!this.isLoggedIn() && this.router.hostComponent.name !== 'Login') {
      this.router.navigate(['Login']);
    }

    this.url = config.getApiUrl();
  }

  login(user: User): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + '/api/auth/check-login', JSON.stringify(user))
        .map(res => res.json())
        .subscribe(data => {
          if (this.processLogin(data)) {
            resolve(true);
          } else {
            reject(false);
          }
        });
    });
  }

  processLogin(data): boolean {
    if (data.status) {
      let decodedToken = this.jwtHelper.decodeToken(data.jwt);
      localStorage.setItem('PI_profile', JSON.stringify(decodedToken));
      localStorage.setItem('PI_id_token', data.jwt);
      this.user = new User(decodedToken);
      return true;
    } 
    else {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('PI_profile');
    localStorage.removeItem('PI_id_token');
    this.user = new User();
  }

  getUserData(): User {
    return this.user;
  }

  isLoggedIn(): boolean {
    return this.user && this.user.username !== null;
  }

}
