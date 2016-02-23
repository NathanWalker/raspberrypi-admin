import {Injectable} from 'angular2/core';


@Injectable()
export class Config {
  api_proto: string = window.location.protocol + '//';
  api_hostname: string = window.location.hostname;
  api_port: string = '22210';
  api_url: string;

  constructor() { this.api_url = this.api_proto + this.api_hostname + ':' + this.api_port; }

  getApiUrl(): string { return this.api_url; }
}
