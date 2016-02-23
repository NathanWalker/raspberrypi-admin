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
import {Auth} from './auth';


describe('Auth Service', () => {

  beforeEachProviders(() => [Auth]);


  it('should ...', inject(
                       [Auth], (service: Auth) => {

                               }));

});
