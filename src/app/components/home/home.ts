import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Socket} from '../../services/socket/socket';
import {Header} from '../header/header';
import {Footer} from '../footer/footer';
import {PrettyTime} from '../../pipes/pretty-time/pretty-time';

@Component({
  selector: 'home',
  templateUrl: 'app/components/home/home.html',
  styleUrls: ['app/components/home/home.css'],
  providers: [Socket],
  directives: [ROUTER_DIRECTIVES, Header, Footer],
  pipes: [PrettyTime]
})
export class Home {
  socketConnection: any;
  uptime: number = 0; 
  osinfo: Object = {};

  constructor(public socket: Socket) {
    this.socketConnection = this.socket.getConnection();
    this.init();
  }

  init(): void {
    this.socketConnection.emit('subscribeToUptime', (uptime) => {
      this.uptime = uptime;
      setInterval(() => {
        this.uptime += 1;
      }, 1000);
    });

    this.socketConnection.emit('subscribeToOSInfo', (osinfo) => {
      this.osinfo = osinfo;
    });
  }

}
