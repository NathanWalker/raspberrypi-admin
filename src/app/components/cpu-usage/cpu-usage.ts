/// <reference path="../../../typings/smoothie.d.ts" />
import {Component, OnDestroy} from 'angular2/core';
import {Socket} from '../../services/socket/socket';
import * as smoothie from 'smoothie';

@Component({
  selector: 'cpu-usage',
  templateUrl: 'app/components/cpu-usage/cpu-usage.html',
  styleUrls: ['app/components/cpu-usage/cpu-usage.css'],
  providers: [Socket],
  directives: [],
  pipes: []
})
export class CpuUsage {
  socketConnection: any;
  usage: number;
  usageDisplay: string;
  sc: any = new smoothie.SmoothieChart({
    minValue: 0,
    maxValue: 100,
    grid: {
      strokeStyle: 'rgb(255, 255, 255)', fillStyle: 'rgb(237, 247, 253)',
      lineWidth: 1, millisPerLine: 250, verticalSections: 6
    },
    labels: { fillStyle: 'rgb(0, 0, 0)' }
  });
  line1: any = new smoothie.TimeSeries();

  constructor(public socket: Socket) {
    this.socketConnection = this.socket.getConnection();

    this.sc.streamTo(document.getElementById('cpu-usage'), 1000);

    this.sc.addTimeSeries(this.line1, { 
      strokeStyle: 'rgb(151, 205, 118)', fillStyle: 'rgba(151, 205, 118, 0.4)', lineWidth: 3 
    });

    this.init();
  }

  init(): void {
    this.socketConnection.emit('subscribeToCpuInfo');

    this.socketConnection.on('getCpuInfo', (data) => {
      this.usage = data.usage * 100;
      this.usageDisplay = this.usage.toFixed(2);
      this.line1.append(new Date().getTime(), this.usage);
    });
  }

  ngOnDestroy(): void {
    this.socketConnection.emit('unsubscribe');
  }

}
