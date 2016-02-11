/// <reference path="../../../typings/smoothie.d.ts" />
import {Component, OnChanges} from 'angular2/core';
import * as smoothie from 'smoothie';

@Component({
  selector: 'ram-usage',
  templateUrl: 'app/components/ram-usage/ram-usage.html',
  styleUrls: ['app/components/ram-usage/ram-usage.css'],
  providers: [],
  directives: [],
  pipes: [],
  inputs: ['data']
})
export class RamUsage {
  socketConnection: any;
  data: any;
  usedPercent: number;
  usedPercentDisplay: string = '';
  freePercent: number;
  freePercentDisplay: string = '';
  sc: any;
  line1: any = new smoothie.TimeSeries();

  init(ram): void {
    this.sc = new smoothie.SmoothieChart({
      minValue: 0,
      maxValue: ram.total,
      grid: {
        strokeStyle: 'rgb(255, 255, 255)', fillStyle: 'rgb(237, 247, 253)',
        lineWidth: 1, millisPerLine: 250, verticalSections: 6
      },
      labels: { fillStyle: 'rgb(0, 0, 0)' }
    });

    this.sc.streamTo(document.getElementById('ram-usage'), 1000);

    this.sc.addTimeSeries(this.line1, {
      strokeStyle: 'rgb(237, 108, 99)', fillStyle: 'rgba(237, 108, 99, 0.4)', lineWidth: 3
    });
  }

  ngOnChanges(): void {
    if (!this.data) { return; }
    if (!this.sc) {
      this.init(this.data.ram);
    }

    this.usedPercent = this.data.ram.used * 100 / this.data.ram.total;
    this.usedPercentDisplay = this.usedPercent.toFixed(0);
    this.freePercent = this.data.ram.free * 100 / this.data.ram.total;
    this.freePercentDisplay = this.freePercent.toFixed(0);

    this.line1.append(new Date().getTime(), this.data.ram.used);
  }

}
