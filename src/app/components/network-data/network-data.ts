import {Component, OnChanges} from 'angular2/core';
import * as smoothie from 'smoothie';

@Component({
  selector: 'network-data',
  templateUrl: 'app/components/network-data/network-data.html',
  styleUrls: ['app/components/network-data/network-data.css'],
  providers: [],
  directives: [],
  pipes: [],
  inputs: ['data']
})
export class NetworkData {
  data: any;
  scs: Array<any> = [];

  constructor() {}

  ngOnChanges(): void {
    if (!this.data) { return; }

    if (!this.scs.length) {
      this.data.forEach((iface, i) => {
        let sc = new smoothie.SmoothieChart({
          grid: {
            strokeStyle: 'rgb(255, 255, 255)', fillStyle: 'rgb(237, 247, 253)',
            lineWidth: 1, millisPerLine: 250, verticalSections: 6
          },
          labels: { fillStyle: 'rgb(0, 0, 0)' }
        });

        this.scs.push(sc);
      });

      this.scs.forEach((sc, i) => {
        sc.downloadLine = new smoothie.TimeSeries();
        sc.uploadLine = new smoothie.TimeSeries();

        setTimeout(() => {
          sc.streamTo(document.getElementById('' + i + ''), 1000);

          sc.addTimeSeries(sc.downloadLine, {
            strokeStyle: 'rgb(151, 205, 118)', fillStyle: 'rgba(151, 205, 118, 0.4)', lineWidth: 3 
          });

          sc.addTimeSeries(sc.uploadLine, {
            strokeStyle: 'rgb(237, 108, 99)', fillStyle: 'rgba(237, 108, 99, 0.4)', lineWidth: 3
          });
        });
      });
    }

    this.data.forEach((iface, i) => {
      this.scs[i].downloadLine.append(new Date().getTime(), parseInt(iface.download_speed, 10));
      this.scs[i].uploadLine.append(new Date().getTime(), parseInt(iface.upload_speed, 10));
    });

  }

  getRandomHexPart(): number {
    return Math.random() * (256 - 1) + 1;
  }

  getRandomHex(): string {
    return 'rgb(' + this.getRandomHexPart() + ', ' +
      this.getRandomHexPart() + ', ' + this.getRandomHexPart() + ')';
  }

}
