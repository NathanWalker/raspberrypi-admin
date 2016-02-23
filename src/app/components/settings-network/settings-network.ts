import {Component} from 'angular2/core';
import {Socket} from '../../services/socket/socket';

@Component({
  selector: 'settings-network',
  templateUrl: 'app/components/settings-network/settings-network.html',
  styleUrls: ['app/components/settings-network/settings-network.css'],
  providers: [Socket],
  directives: [],
  pipes: []
})
export class SettingsNetwork {
  socketConnection: any;
  interfaces: Array<any> = [];
  loading: boolean = false;
  WLANStationConfig: boolean = false;
  iface: string = '';
  WLANWizardsModal: boolean = false;
  wifiNetworks: Array<any> = [];
  wifiScanning: boolean = false;
  wifiConnecting: boolean = false;
  wifiConnectingWlan: any = {};

  constructor(public socket: Socket) {
    this.socketConnection = this.socket.getConnection();
    this.getInterfaces();
  }

  getInterfaces(): void {
    this.loading = true;
    this.socketConnection.emit('subscribeToNetInterfaces', (data) => {
      this.loading = false;
      this.interfaces = data;
    });
  }

  WLANWizardsButton(iface: string): void {
    this.iface = iface;
    this.WLANWizardsModal = true;
  }

  configureWLANStation(iface: string): void {
    this.WLANStationConfig = true;
    this.iface = iface;
    this.scanWifi(iface);
  }

  scanWifi(iface: string): void {
    this.wifiNetworks = [];
    this.wifiScanning = true;
    this.wifiConnecting = false;
    this.socketConnection.emit('subscribeToWifiScan', iface, (data) => {
      this.wifiScanning = false;
      this.wifiNetworks = data;
    });
  }

  wifiConnect(wlan: Object): void {
    this.wifiConnecting = true;
    this.wifiConnectingWlan = wlan;
    this.wifiConnectingWlan.iface = this.iface;
    this.socketConnection.emit('subscribeToConnectWifi', this.wifiConnectingWlan, (data) => {
      this.wifiConnecting = false;
      if (data) {
        this.closeModals();
        this.getInterfaces();
      } else {
        this.wifiConnecting = false;
      }
    });
  }

  closeModals(): void {
    this.WLANStationConfig = false;
    this.WLANWizardsModal = false;
  }
}
