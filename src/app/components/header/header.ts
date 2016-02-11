import {Component} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {Auth} from '../../services/auth/auth';

@Component({
  selector: 'header',
  templateUrl: 'app/components/header/header.html',
  styleUrls: ['app/components/header/header.css'],
  providers: [Auth],
  directives: [ROUTER_DIRECTIVES],
  pipes: []
})
export class Header {

  constructor(public auth: Auth, public router: Router) { }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['Login']);
  }

}
