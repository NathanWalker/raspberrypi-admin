import {Component, OnDestroy} from 'angular2/core';
import {Socket} from '../../services/socket/socket';

@Component({
  selector: 'cpu-info',
  templateUrl: 'app/components/cpu-info/cpu-info.html',
  styleUrls: ['app/components/cpu-info/cpu-info.css'],
  providers: [Socket],
  directives: [],
  pipes: []
})
export class CpuInfo {
  socketConnection: any;
  cpuInfo: any;

  constructor(public socket: Socket) {
    this.socketConnection = this.socket.getConnection();
    this.init();
  }

  init(): void {
    this.socketConnection.emit('subscribeToCpuData', (data) => {
      this.cpuInfo = data;
    });
  }

  ngOnDestroy(): void {
    this.socketConnection.emit('unsubscribe');
  }

}
