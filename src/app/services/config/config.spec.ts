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
import {Config} from './config';


describe('Config Service', () => {

  beforeEachProviders(() => [Config]);


  it('should ...', inject([Config], (service:Config) => {

  }));

});
