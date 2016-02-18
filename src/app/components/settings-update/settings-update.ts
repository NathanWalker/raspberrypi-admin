import {Component} from 'angular2/core';
import {Socket} from '../../services/socket/socket';

@Component({
  selector: 'settings-update',
  templateUrl: 'app/components/settings-update/settings-update.html',
  styleUrls: ['app/components/settings-update/settings-update.css'],
  providers: [Socket],
  directives: [],
  pipes: []
})
export class SettingsUpdate {
  socketConnection: any;
  responseData: Array<any> = [];
  updateButton: boolean = false;
  upgradeButton: boolean = false;
  isUpgrading: boolean = false;
  isDone: boolean = false;
  systemUpdated: boolean = false;

  constructor(public socket: Socket) {
    this.socketConnection = this.socket.getConnection();
    this.init();
  }

  init(): void {
    this.responseData.push('Loading...');
    this.socketConnection.emit('subscribeToLastUpdate', (data) => {
      this.responseData = data;
      this.responseData[0] = 'Last updated at: ' + this.responseData[0];
      this.updateButton = true;
    });
  }

  update(): void {
    this.updateButton = false;
    this.responseData[0] = 'Updating source repositories, please wait...';
    this.socketConnection.emit('subscribeToUpdates', (data) => {
      this.socketConnection.emit('subscribeToCheckUpgrades', (data) => {
        this.responseData = data;
        if (this.responseData.length) {
          this.upgradeButton = true;
        }
        else {
          this.systemUpdated = true;
        }
      });
    });
  }

  upgrade(): void {
    this.responseData = [];
    this.isUpgrading = true;
    this.socketConnection.emit('subscribeToUpgrade', (data) => {
      this.responseData = data;
      this.isUpgrading = false;
      this.upgradeButton = false;
      this.isDone = true;
    });
  }

}
