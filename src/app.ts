import {bootstrap} from 'angular2/platform/browser';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {DashApp} from './app/dash';
import {Config} from './app/services/config/config';

bootstrap(DashApp, [ROUTER_PROVIDERS, HTTP_PROVIDERS, Config]);
