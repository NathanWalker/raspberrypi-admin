import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {Home} from './components/home/home';
import {Dashboard} from './components/dashboard/dashboard';
import {Settings} from './components/settings/settings';
import {Users} from './components/users/users';
import {Login} from './components/login/login';


@Component({
  selector: 'dash-app',
  providers: [],
  templateUrl: 'app/dash.html',
  directives: [ROUTER_DIRECTIVES],
  pipes: []
})
@RouteConfig([
  { path: '/', name: 'Home', component: Home, useAsDefault: true },
  { path: '/dashboard/...', name: 'Dashboard', component: Dashboard },
  { path: '/settings', name: 'Settings', component: Settings },
  { path: '/users', name: 'Users', component: Users },
  { path: '/login', name: 'Login', component: Login }
])
export class DashApp {

  constructor() {
    
  }

}
