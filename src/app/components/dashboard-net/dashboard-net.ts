import {Component, OnInit, OnDestroy} from 'angular2/core';
import {Socket} from '../../services/socket/socket';
import {NetworkData} from '../network-data/network-data';
import {NetworkConnections} from '../network-connections/network-connections';

@Component({
  selector: 'dashboard-net',
  templateUrl: 'app/components/dashboard-net/dashboard-net.html',
  styleUrls: ['app/components/dashboard-net/dashboard-net.css'],
  providers: [Socket],
  directives: [NetworkData, NetworkConnections],
  pipes: []
})
export class DashboardNet {
  socketConnection: any;
  networkData: any;
  connectionsData: Array<any>;

  constructor(public socket: Socket) {
    this.socketConnection = this.socket.getConnection();
  }
  
  ngOnInit(): void {
    this.socketConnection.emit('subscribeToNetworkInfo');
    this.socketConnection.on('getNetworkInfo', (data) => { this.networkData = data; });
    this.socketConnection.on('getNetworkSpeed', (data) => { this.networkData = data; });
    this.socketConnection.emit('subscribeToNetworkConnections');
    this.socketConnection.on('getNetworkConnections', (data) => { this.connectionsData = data; }); 
  }

  ngOnDestroy(): void { this.socketConnection.emit('unsubscribe'); }
}
