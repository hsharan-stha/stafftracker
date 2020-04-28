export function formatDate(ISOdateStr) {
    let date = new Date(ISOdateStr);
    let month = date.getMonth() + 1;
    let monthStr = month.toString();
    let day = date.getDate();
    let dayStr = day.toString();
    let hours = date.getHours();
    let hoursStr = hours.toString();
    let minutes = date.getMinutes();
    let minutesStr = minutes.toString();
    let seconds = date.getSeconds();
    let secondsStr = seconds.toString();
    if (monthStr.length === 1) {
        monthStr = '0' + monthStr;
    }
    if (dayStr.length === 1) {
        dayStr = '0' + dayStr;
    }
    if (hoursStr.length === 1) {
        hoursStr = '0' + hoursStr;
    }
    if (minutesStr.length === 1) {
        minutesStr = '0' + minutesStr;
    }
    if (secondsStr.length === 1) {
        secondsStr = '0' + secondsStr;
    }
    let dateStr = date.getFullYear() + '-' + monthStr + '-' + dayStr +' '+hoursStr + ':' + minutesStr + ':' + secondsStr;
    return dateStr;
}


