import {Component} from 'angular2/core';
import {RouteConfig, RouterOutlet, ROUTER_DIRECTIVES} from 'angular2/router';
import {Header} from '../header/header';
import {Footer} from '../footer/footer';
import {DashboardCpu} from '../dashboard-cpu/dashboard-cpu';
import {DashboardRam} from '../dashboard-ram/dashboard-ram';
import {DashboardStorage} from '../dashboard-storage/dashboard-storage';
import {DashboardNet} from '../dashboard-net/dashboard-net';

@Component({
  selector: 'dashboard',
  templateUrl: 'app/components/dashboard/dashboard.html',
  styleUrls: ['app/components/dashboard/dashboard.css'],
  providers: [],
  directives: [RouterOutlet, Header, Footer, ROUTER_DIRECTIVES],
  pipes: []
})
@RouteConfig([
  { path: '/cpu', name: 'DashboardCpu', component: DashboardCpu, useAsDefault: true },
  { path: '/ram', name: 'DashboardRam', component: DashboardRam },
  { path: '/storage', name: 'DashboardStorage', component: DashboardStorage },
  { path: '/net', name: 'DashboardNet', component: DashboardNet }
])
export class Dashboard {

  constructor() {}

}
