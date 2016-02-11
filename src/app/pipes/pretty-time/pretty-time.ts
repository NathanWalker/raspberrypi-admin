import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
  name: 'PrettyTime'
})
export class PrettyTime implements PipeTransform {

  transform(value) {
    return this.toPrettyTime(value);
  }

  toPrettyTime(seconds): string {
    let dur = {};
    let units = [
      { label: "seconds", mod: 60 },
      { label: "minutes", mod: 60 },
      { label: "hours", mod: 24 },
      { label: "days", mod: 31 }
    ];

    units.forEach(u => {
      seconds = (seconds - (dur[u.label] = (seconds % u.mod))) / u.mod;
    });

    dur.toString = () => {
      let str = units.reverse().map(u => {
        return dur[u.label] === 0 ? '' : dur[u.label] + " " + (dur[u.label] === 1 ? u.label.slice(0, -1) : u.label);
      }).join(', ');

      str = str.split(',').filter(p => {
        return p.trim() !== '';
      }).join(', ');

      return str;
    };

    return dur.toString();
  }

}
