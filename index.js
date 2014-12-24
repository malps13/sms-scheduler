var smsapipl = require('smsapi-pl');
var schedule = require('node-schedule');

var config = require('./config/config.json');
var smsArray = require('./config/sms.json');
var smsJobs = [];

for (var i = 0; i < smsArray.length; i++) {
  var sms = smsArray[i];
  var smsDate = smsArray[i].date.split("-");
  var smsTime = smsArray[i].time ? smsArray[i].time.split(":") : config.defaultTime.split(":");

  var now = new Date();
  var date = new Date(parseInt(smsDate[0]), parseInt(smsDate[1])-1, parseInt(smsDate[2]), parseInt(smsTime[0]), parseInt(smsTime[1]), 0);

  if (date > now && smsArray[i].message) {
    smsJobs[i] = schedule.scheduleJob(date, function (i) {
      return function () {
        var index = i;
        var sms = smsArray[index];
        // sending sms
        console.log("---\n[" + new Date() + "] sending message: " + sms.message + "\n---");
        sendSms(sms.message, config.phoneNumber);
      };
    }(i));
  }
}

function sendSms(message, number) {
  var sender = new smsapipl.API({
    username: config.username,
    password: config.password
  });

  var msg = new smsapipl.Message({
    to: number,
    message: message,
    encoding: config.encoding,
  });

  sender.send(msg, function (err, cb) {
    if (err) {
      console.log(err.message);
    } else {
      console.log(cb);
    }
  });
}