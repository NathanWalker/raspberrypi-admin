/// <reference path="../../../typings/smoothie.d.ts" />
import {Component, OnInit, OnChanges} from 'angular2/core';
import * as smoothie from 'smoothie';

@Component({
  selector: 'swap-usage',
  templateUrl: 'app/components/swap-usage/swap-usage.html',
  styleUrls: ['app/components/swap-usage/swap-usage.css'],
  providers: [],
  directives: [],
  pipes: [],
  inputs: ['data']
})
export class SwapUsage {
  socketConnection: any;
  data: any;
  usedPercent: number;
  usedPercentDisplay: string = '';
  freePercent: number;
  freePercentDisplay: string = '';
  sc: any;
  line1: any = new smoothie.TimeSeries();

  init(swap): void {
    this.sc = new smoothie.SmoothieChart({
      minValue: 0,
      maxValue: swap.total,
      grid: {
        strokeStyle: 'rgb(255, 255, 255)',
        fillStyle: 'rgb(237, 247, 253)',
        lineWidth: 1,
        millisPerLine: 250,
        verticalSections: 6
      },
      labels: {fillStyle: 'rgb(0, 0, 0)'}
    });

    this.sc.streamTo(document.getElementById('swap-usage'), 1000);

    this.sc.addTimeSeries(
        this.line1,
        {strokeStyle: 'rgb(237, 108, 99)', fillStyle: 'rgba(237, 108, 99, 0.4)', lineWidth: 3});
  }

  ngOnChanges(): void {
    if (!this.data) {
      return;
    }
    if (!this.sc) {
      this.init(this.data.swap);
    }

    this.usedPercent = this.data.swap.used * 100 / this.data.swap.total;
    this.usedPercentDisplay = this.usedPercent.toFixed(0);
    this.freePercent = this.data.swap.free * 100 / this.data.swap.total;
    this.freePercentDisplay = this.freePercent.toFixed(0);

    this.line1.append(new Date().getTime(), this.data.swap.used);
  }
}
