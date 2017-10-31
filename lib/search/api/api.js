let PIL = require('./PIL/apiPIL.js')

const steamshipLineToURL = (bookingNumber, steamshipLine) => {
  // Map steamshipLine to the correctly formatted URL
  switch(steamshipLine) {
    case 'PIL':
      return `https://www.pilship.com/shared/ajax/?fn=get_tracktrace_bl&ref_num=${bookingNumber}&_=1509229620794`
    default: 
      // TODO: Implement Error Handling
      throw new Error('Cannot find steamshipLine: ' + steamshipLine +'. Please make sure the steamshipLine exists.')
  }
}

const responseToData = (res, steamshipLine) => {
  switch(steamshipLine) {
    case 'PIL':
      return PIL.PILResponseToData(res)
    default:
      // TODO: Implement Error Handling
      throw new Error('Cannot find steamshipLine: ' + steamshipLine +'. Please make sure the steamshipLine exists.')
  }
}

module.exports = {
  steamshipLineToURL: steamshipLineToURL,
  responseToData: responseToData
} 