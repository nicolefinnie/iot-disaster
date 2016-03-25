/*eslint-env node */

// server side 
exports.sendMessage = function(twilio, twilioSid, twilioToken){
  return function(req, res) {
    var SMSData = req.body;
    var client = new twilio.RestClient(twilioSid, twilioToken);
    SMSData.targetNumber.forEach(function(toNumber){
      client.sendMessage({
        to: toNumber,
        from: SMSData.fromNumber,
        body: SMSData.message
      }, function(err, message) {
        if (err) {
          console.log('twilioServer: Error sending SMS to ' + toNumber + ', err: ' + JSON.stringify(err));
        }
      });
    });
    var returnMessage = 'SMS messages sent to ' + SMSData.targetNumber.length + ' recipients';
    console.log(returnMessage);
    res.send(returnMessage);
  };
 
};