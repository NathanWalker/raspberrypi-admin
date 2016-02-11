import {Component} from 'angular2/core';
import {CpuLoadAvg} from '../cpu-load-avg/cpu-load-avg';
import {CpuUsage} from '../cpu-usage/cpu-usage';
import {CpuTemp} from '../cpu-temp/cpu-temp';
import {CpuInfo} from '../cpu-info/cpu-info';

@Component({
  selector: 'dashboard-cpu',
  templateUrl: 'app/components/dashboard-cpu/dashboard-cpu.html',
  styleUrls: ['app/components/dashboard-cpu/dashboard-cpu.css'],
  providers: [],
  directives: [CpuLoadAvg, CpuUsage, CpuTemp, CpuInfo],
  pipes: []
})
export class DashboardCpu {

  constructor() {}

}
