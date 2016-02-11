import {Component, OnChanges} from 'angular2/core';

@Component({
  selector: 'storage-data',
  templateUrl: 'app/components/storage-data/storage-data.html',
  styleUrls: ['app/components/storage-data/storage-data.css'],
  providers: [],
  directives: [],
  pipes: [],
  inputs: ['data']
})
export class StorageData {
  data: any;

  constructor() {}

}
