let date = new Date("2018-11-15T00:00:00+01:00");

let hour = date;
console.log(hour.getHours());
console.log(hour.getMinutes());
hour = hour.getHours().toString().padStart(2, '0') + ":" + hour.getMinutes().toString().padStart(2, '0');
console.log(hour);