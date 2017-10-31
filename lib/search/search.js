const fetch = require('node-fetch')
const api = require('./api/api')

const byBookingNumberAndSteamshipLine = (bookingNumber, steamshipLine) => {
  // Query the correct Company Site for data
  const URL = api.steamshipLineToURL(bookingNumber, steamshipLine)

  // Define header
  const header = {
    'Accept-Language': 'en-us',
    'Content-Type' : 'text/html'
  }
  return new Promise((resolve, reject) => {
    fetch(URL, header)
    .then((res) => res.text())                              // Process res 
    .then((body) => {
      // Remove first char because it is unreckognized by node.js; convert to JSON obj.
      body = JSON.parse(body.substring(1))  
      if (body.data.err) { return Promise.reject(body.data.err_msg) } 

      let data = api.responseToData(body, steamshipLine)  
      data.bookingNumber = bookingNumber
      data.steamshipLine = steamshipLine

      return resolve(data)
    })
    .catch((err) => {
      return reject(err)
    });
  })
  
}



module.exports = {
  byBookingNumberAndSteamshipLine: byBookingNumberAndSteamshipLine
} 