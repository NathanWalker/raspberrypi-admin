import {
  it,
  iit,
  describe,
  ddescribe,
  expect,
  inject,
  injectAsync,
  TestComponentBuilder,
  beforeEachProviders
} from 'angular2/testing';
import {provide} from 'angular2/core';
import {Socket} from './socket';


describe('Socket Service', () => {

  beforeEachProviders(() => [Socket]);


  it('should ...', inject(
                       [Socket], (service: Socket) => {

                                 }));

});
