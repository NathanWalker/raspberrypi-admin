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
import {PrettyTime} from './pretty-time';


describe('PrettyTime Pipe', () => {

  beforeEachProviders(() => [PrettyTime]);


  it('should transform the input', inject([PrettyTime], (pipe:PrettyTime) => {
      expect(pipe.transform(true)).toBe(null);
  }));

});
