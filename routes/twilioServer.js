/*eslint-env node */

// server side 
exports.sendMessage = function(twilio, twilioSid, twilioToken){
  return function(req, res) {
    console.log('SMS sent');
    console.log('phone number ' +JSON.stringify(req.body.phoneNumber));
    console.log('message ' +JSON.stringify(req.body.message));
    
    var client = new twilio.RestClient(twilioSid, twilioToken);
    client.sendMessage({
        to: req.body.phoneNumber,
        from: '+4915735993514',
        body: req.body.message
    }, function(err, message) {
        res.send('Message sent! ID: '+message.sid);
    });
    
  };
 
};