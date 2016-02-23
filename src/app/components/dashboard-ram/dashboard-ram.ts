import {Component, OnDestroy} from 'angular2/core';
import {Socket} from '../../services/socket/socket';
import {RamUsage} from '../ram-usage/ram-usage';
import {SwapUsage} from '../swap-usage/swap-usage';


@Component({
  selector: 'dashboard-ram',
  templateUrl: 'app/components/dashboard-ram/dashboard-ram.html',
  styleUrls: ['app/components/dashboard-ram/dashboard-ram.css'],
  providers: [Socket],
  directives: [RamUsage, SwapUsage],
  pipes: []
})
export class DashboardRam {
  socketConnection: any;
  data: any;

  constructor(public socket: Socket) {
    this.socketConnection = this.socket.getConnection();
    this.init();
  }

  init(): void {
    this.socketConnection.emit('subscribeToMemoryInfo');

    this.socketConnection.on('getMemoryInfo', (data) => { this.data = data; });
  }

  ngOnDestroy(): void { this.socketConnection.emit('unsubscribe'); }
}
