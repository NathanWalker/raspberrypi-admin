import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Header} from '../header/header';
import {Footer} from '../footer/footer';


@Component({
  selector: 'users',
  templateUrl: 'app/components/users/users.html',
  styleUrls: ['app/components/users/users.css'],
  providers: [],
  directives: [ROUTER_DIRECTIVES, Header, Footer],
  pipes: []
})
export class Users {
  constructor() {}
}
