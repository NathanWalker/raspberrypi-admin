import {Component, OnChanges} from 'angular2/core';


@Component({
  selector: 'network-connections',
  templateUrl: 'app/components/network-connections/network-connections.html',
  styleUrls: ['app/components/network-connections/network-connections.css'],
  providers: [],
  directives: [],
  pipes: [],
  inputs: ['data']
})
export class NetworkConnections {
  data: any;

  constructor() {}

}
