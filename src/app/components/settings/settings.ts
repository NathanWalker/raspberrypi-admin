import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Header} from '../header/header';
import {Footer} from '../footer/footer';


@Component({
  selector: 'settings',
  templateUrl: 'app/components/settings/settings.html',
  styleUrls: ['app/components/settings/settings.css'],
  providers: [],
  directives: [ROUTER_DIRECTIVES, Header, Footer],
  pipes: []
})
export class Settings {

  constructor() {}

}
