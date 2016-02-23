/// <reference path="../../../typings/smoothie.d.ts" />
import {Component, OnInit, OnDestroy} from 'angular2/core';
import {Socket} from '../../services/socket/socket';
import * as smoothie from 'smoothie';

@Component({
  selector: 'cpu-load-avg',
  templateUrl: 'app/components/cpu-load-avg/cpu-load-avg.html',
  styleUrls: ['app/components/cpu-load-avg/cpu-load-avg.css'],
  providers: [Socket],
  directives: [],
  pipes: []
})
export class CpuLoadAvg {
  socketConnection: any;
  load: Object;
  sc: any = new smoothie.SmoothieChart({
    grid: {
      strokeStyle: 'rgb(255, 255, 255)',
      fillStyle: 'rgb(237, 247, 253)',
      lineWidth: 1,
      millisPerLine: 250,
      verticalSections: 6
    },
    labels: {fillStyle: 'rgb(0, 0, 0)'}
  });
  line1: any = new smoothie.TimeSeries();
  line2: any = new smoothie.TimeSeries();
  line3: any = new smoothie.TimeSeries();

  constructor(public socket: Socket) {
    this.socketConnection = this.socket.getConnection();
  }

  ngOnInit(): void {
    this.sc.streamTo(document.getElementById('cpu-load-avg'), 1000);

    this.sc.addTimeSeries(this.line1, {
      strokeStyle: 'rgb(151, 205, 118)', 
      fillStyle: 'rgba(151, 205, 118, 0.4)', 
      lineWidth: 3
    });
    this.sc.addTimeSeries(this.line2, {
      strokeStyle: 'rgb(252, 228, 115)', 
      fillStyle: 'rgba(252, 228, 115, 0.4)', 
      lineWidth: 3
    });
    this.sc.addTimeSeries(this.line3, {
      strokeStyle: 'rgb(237, 108, 99)', 
      fillStyle: 'rgba(237, 108, 99, 0.4)', 
      lineWidth: 3
    });
    
    this.init();
  }

  init(): void {
    this.socketConnection.emit('subscribeToCpuLoadAverage');

    this.socketConnection.on('getCpuLoadAverage', (data) => {
      this.load = {
        1: data['1min'].toFixed(2), 
        5: data['5min'].toFixed(2), 
        15: data['15min'].toFixed(2)
      };

      this.line1.append(new Date().getTime(), this.load[1]);
      this.line2.append(new Date().getTime(), this.load[5]);
      this.line3.append(new Date().getTime(), this.load[15]);
    });
  }

  ngOnDestroy(): void { this.socketConnection.emit('unsubscribe'); }
}
