export const convertDate = (date: string) => {
  let datetime = [];
  if (date.includes('T')) {
    if (date.includes('Z')) {
      if (date.includes('-')) {
        datetime = date.replace('Z', '').split('T');
        datetime[0] = datetime[0].replace(/-/g, '/');
        datetime[0] = datetime[0].split('/');
        datetime[0] = [datetime[0][2], datetime[0][1], datetime[0][0]];
        datetime[0] = datetime[0].join('/');
      } else {
        datetime = date.replace('Z', '').split('T');
      }
    } else {
      if (date.includes('-')) {
        datetime = date.replace(/-/g, '/').split('T');
      } else {
        datetime = date.split('T');
      }
    }
  } else {
    datetime = date.split(' ');
  }
  if (datetime[2] && (datetime[2] === 'AM' || datetime[2] === 'PM')) {
    const splitDT = datetime[1].split(':');
    if (splitDT[2]) {
      return date;
    } else {
      datetime[1] = splitDT[0] + ':' + splitDT[1] + ':00';
      return datetime.join(' ');
    }
  }
  const time = datetime[1].split(':');
  if (parseInt(time[0]) === 0) time[0] = '12';
  if (time[2]) time[1] += `:${time[2]}`;
  else time[1] += `:00`;
  const day = datetime[0].split('/')[0];
  const month = datetime[0].split('/')[1];
  let dates = day.length > 1 ? datetime[0] : `0${datetime[0]}`;
  if (month.length > 1) {
    dates = dates;
  } else {
    const splittedDate = dates.split('/');
    splittedDate[1] = '0' + splittedDate[1];
    dates = splittedDate.join('/');
  }

  if (parseInt(time[0]) > 12) {
    const convertedTime = (parseInt(time[0]) - 12).toString();
    const zero = convertedTime.length > 1 ? ' ' : ' 0';
    return dates + `${zero}${parseInt(convertedTime)}:` + time[1] + ' PM';
  }
  const convertedTime = time[0];
  const zero = convertedTime.length > 1 ? ' ' : ' 0';
  return dates + `${zero}${parseInt(convertedTime)}:` + time[1] + ' AM';
};
