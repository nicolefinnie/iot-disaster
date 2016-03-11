/*eslint-env node */

// server side 
exports.sendMessage = function(twilio, twilioSid, twilioToken){
  return function(req, res) {
    console.log('SMS sent');
    console.log('phone number ' +JSON.stringify(req.body.phoneNumber));
    console.log('message ' +JSON.stringify(req.body.message));
    
    var client = new twilio.RestClient(twilioSid, twilioToken);
    client.sendMessage({
        to: '+4915170002048',
        from: '+4915735994570',
        body: 'WAKE UP PLEASE'
    }, function(err, message) {
        res.send('Message sent! ID: '+ JSON.stringify(message));
    });
    
  };
 
};