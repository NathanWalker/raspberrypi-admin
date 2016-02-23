import {Component, OnChanges, OnDestroy} from 'angular2/core';
import {Socket} from '../../services/socket/socket';
import {StorageData} from '../storage-data/storage-data';

@Component({
  selector: 'dashboard-storage',
  templateUrl: 'app/components/dashboard-storage/dashboard-storage.html',
  styleUrls: ['app/components/dashboard-storage/dashboard-storage.css'],
  providers: [Socket],
  directives: [StorageData],
  pipes: []
})
export class DashboardStorage {
  socketConnection: any;
  storageData: any;

  constructor(public socket: Socket) {
    this.socketConnection = this.socket.getConnection();
    this.init();
  }

  init(): void {
    this.socketConnection.emit('subscribeToStorageData');

    this.socketConnection.on('getStorageData', (data) => { this.storageData = data; });
  }

  ngOnDestroy(): void { this.socketConnection.emit('unsubscribe'); }
}
