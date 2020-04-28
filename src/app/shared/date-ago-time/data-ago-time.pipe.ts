import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'dateAgo',
  pure: true
})
export class DateAgoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    var now = Math.floor(new Date().getTime() / 1000);
    let timeremains = now - value;
    var ago;
    if (timeremains >= 0) {
      if (timeremains < 29) {
        return 'Just now';
      } else if (timeremains >= 29 && timeremains < 60) {
        return timeremains + " seconds ago";
      } else if (timeremains >= 60 && timeremains < 3600) {
        ago = (timeremains < 120) ? " minute" : " minute's";
        return Math.floor(timeremains / 60) + ago + " ago";
      } else if (timeremains >= 3600 && timeremains < 86400) {
        ago = (timeremains < 120) ? " hour" : " hour's";
        return Math.floor(timeremains / 3600) + ago + " ago";
      } else if (timeremains >= 86400 && timeremains < 604800) {
        ago = (timeremains < 120) ? " week" : " week's";
        return Math.floor(timeremains / 86400) + ago + " ago";
      } else if (timeremains >= 604800 && timeremains < 2592000) {
        ago = (timeremains < 120) ? " month" : " month's";
        return Math.floor(timeremains / 604800) + ago + " ago";
      } else if (timeremains >= 2592000 && timeremains < 31536000) {
        ago = (timeremains < 120) ? " year" : " year's";
        return Math.floor(timeremains / 2592000) + ago + " ago";
      }
      // const intervals = {
      //   'year': 31536000,
      //   'month': 2592000,
      //   'week': 604800,
      //   'day': 86400,
      //   'hour': 3600,
      //   'minute': 60,
      //   'second': 1
      // };
      // let counter;
      // for (const i in intervals) {
      //   counter = Math.floor(value / intervals[i]);
      //   if (counter > 0)
      //     if (counter === 1) {
      //       return counter + ' ' + i + ' ago'; // singular (1 day ago)
      //     } else {
      //       return counter + ' ' + i + 's ago'; // plural (2 days ago)
      //     }
      // }
    }
  }
}
