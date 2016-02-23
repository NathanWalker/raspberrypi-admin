import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';
import {Header} from '../header/header';
import {Footer} from '../footer/footer';

import {SettingsBasic} from '../settings-basic/settings-basic';
import {SettingsNetwork} from '../settings-network/settings-network';
import {SettingsFirewall} from '../settings-firewall/settings-firewall';
import {SettingsVpn} from '../settings-vpn/settings-vpn';
import {SettingsUpdate} from '../settings-update/settings-update';
import {SettingsLogs} from '../settings-logs/settings-logs';

@Component({
  selector: 'settings',
  templateUrl: 'app/components/settings/settings.html',
  styleUrls: ['app/components/settings/settings.css'],
  providers: [],
  directives: [ROUTER_DIRECTIVES, Header, Footer],
  pipes: []
})
@RouteConfig([
  {path: 'basic', name: 'SettingsBasic', component: SettingsBasic, useAsDefault: true},
  {path: 'network', name: 'SettingsNetwork', component: SettingsNetwork},
  {path: 'firewall', name: 'SettingsFirewall', component: SettingsFirewall},
  {path: 'vpn', name: 'SettingsVpn', component: SettingsVpn},
  {path: 'update', name: 'SettingsUpdate', component: SettingsUpdate},
  {path: 'logs', name: 'SettingsLogs', component: SettingsLogs}
])
export class Settings {
  constructor() {}
}
