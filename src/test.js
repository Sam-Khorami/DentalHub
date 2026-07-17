var date = new Date();
var date2 = new Date();
console.log(date.getDay());
console.log(date.getTime());
console.log(date.getHours());
console.log(date.getMinutes());
console.log(date.getSeconds());
console.log(date.getDate());
console.log(date.getMonth());
var randomTime = "11:45:00";
var time = "".concat(date.getHours(), ":").concat(date.getMinutes(), ":").concat(date.getSeconds());
console.log(time);
if (randomTime > time)
    console.log("true");
else
    console.log("false");
