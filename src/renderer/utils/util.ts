export function displayTime(time: number) {
  const secs = (time / 1000) % 60;
  const min = (time / 1000 / 60) % 60;
  const hours = (time / 1000 / 60 / 60) % 24;
  const days = (time / 1000 / 60 / 60 / 24) % 365;
  const years = time / 1000 / 60 / 60 / 24 / 30 / 365;

  let str = '';

  if (years >= 1) {
    str += Math.floor(years) + 'y ';
  }

  if (days >= 1) {
    str += Math.floor(days) + 'd ';
  }

  if (hours >= 1) {
    str += Math.floor(hours) + 'h ';
  }

  if (min >= 1) {
    str += Math.floor(min) + 'm ';
  }

  if (secs >= 1) {
    str += Math.floor(secs) + 's';
  }

  return str.trim();
}
