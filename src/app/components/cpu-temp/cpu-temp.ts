/// <reference path="../../../typings/smoothie.d.ts" />
import {Component, OnDestroy} from 'angular2/core';
import {Socket} from '../../services/socket/socket';
import * as smoothie from 'smoothie';

@Component({
  selector: 'cpu-temp',
  templateUrl: 'app/components/cpu-temp/cpu-temp.html',
  styleUrls: ['app/components/cpu-temp/cpu-temp.css'],
  providers: [Socket],
  directives: [],
  pipes: []
})
export class CpuTemp {
  socketConnection: any;
  temp: number;
  tempDisplay: string;
  tempDisplayFahrenheit: string;
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

    this.sc.streamTo(document.getElementById('cpu-temp'), 1000);

    this.sc.addTimeSeries(this.line1, {
      strokeStyle: 'rgb(151, 205, 118)', fillStyle: 'rgba(151, 205, 118, 0.4)', lineWidth: 3
    });

    this.init();
  }

  init(): void {
    this.socketConnection.emit('subscribeToCpuTemp');

    this.socketConnection.on('getCpuTemp', (data) => {
      this.temp = data / 1000;
      this.tempDisplay = this.temp.toFixed(2);
      this.tempDisplayFahrenheit = ((this.temp * 1.8) + 32).toFixed(2);
      this.line1.append(new Date().getTime(), this.temp);
    });
  }

  ngOnDestroy(): void {
    this.socketConnection.emit('unsubscribe');
  }

}
