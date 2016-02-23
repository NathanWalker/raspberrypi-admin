import {Injectable} from 'angular2/core';
import {Config} from '../config/config';

declare var io;

@Injectable()
export class Socket {
  url: string;
  socket: any;

  constructor(public config: Config) {
    this.url = this.config.getApiUrl();

    if (!this.socket) {
      this.connect();
    }
  }

  connect(): void { this.socket = io.connect(this.url); }

  getConnection(): any { return this.socket; }
}
