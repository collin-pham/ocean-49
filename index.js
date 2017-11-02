var express = require('express');
var bodyParser = require('body-parser');
var search = require('./lib/search/search.js')

var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Allow request from any URL for now
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// Handle all GET requests
app.get('*', (req, res) => {
  res.type('text/html'); 
  res.status(200); 
  res.send('Terminal 49 API')
});

// Main API functionality
app.post('/search', (req, res) => {
  // Parse request body
  const bookingNumber = req.body.bookingNumber
  const steamshipLine = req.body.steamshipLine

  // Error Check
  if (!bookingNumber) { res.status(400).send('Missing required field bookingNumber') }
  if (!steamshipLine) { res.status(400).send('Missing required field steamshipLine') }

  // Search for booking details based on a given bookingNumber and steamshipLine
  search.byBookingNumberAndSteamshipLine(bookingNumber, steamshipLine)
  .then((data) => { res.send(data) })
  .catch((err) => { res.status(400).send(err) })
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
