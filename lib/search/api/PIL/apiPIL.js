const cheerio = require('cheerio')
/*
  1. B/L Number: TXG790195200
  2. Steamship Line: PIL
  3. Origin: Xingang
  4. Destination: Oakland
  5. Vessel: CSCL AUTUMN
  6. Voyage: VQC60007E
  7. Vessel ETA: April 19, 2017
  8. List of containers: for each container display: 
    1. Number: SEGU1712879
    2. Size: 20’
    3. Type: GP
  9. 
*/


const PILResponseToData = (body) => {  
  const payload = {
    origin              : PILResponseToOrigin(body),
    destination         : PILResponseToDestination(body),
    vessel              : PILResponseToVessel(body),
    voyage              : PILResponseToVoyage(body),
    arrival             : PILResponseToArrival(body),
    containers          : PILResponseToContainers(body) 
  }
  
  return payload
}

const PILResponseToOrigin = (body) => {
  let rawOrigin = body.data.scheduleinfo.split('<br />')[0]
  rawOrigin = rawOrigin.split('<b>')[1]

  // Extract the Origin
  let origin = ''
  let i = 0
  while ((rawOrigin[i] != ' ') && (rawOrigin[i] != '[') && (i < rawOrigin.length)) { 
    origin += rawOrigin[i] 
    i++
  }
  return origin
}

const PILResponseToDestination = (body) => {
  let rawDestination = body.data.scheduleinfo.split('<br />')[1]
  rawDestination = rawDestination.split('<b>')[1]

  // Extract the Destination
  let destination = ''
  let i = 0
  while ((rawDestination[i] != ' ') && (rawDestination[i] != '[') && (i < rawDestination.length)) { 
    destination += rawDestination[i] 
    i++
  }
  return destination
}

const PILResponseToVessel = (body) => {
  const $ = cheerio.load('<table>' + body.data.scheduletable + '</table>')
  const vessel = $('td[class=vessel-voyage]').html().split('<br>')[1]
  return vessel
}
const PILResponseToVoyage = (body) => {
  const $ = cheerio.load('<table>' + body.data.scheduletable + '</table>')
  const voyage = $('td[class=vessel-voyage]').html().split('<br>')[2]
  return voyage
}
const PILResponseToArrival = (body) => {
  const $ = cheerio.load('<table>' + body.data.scheduletable + '</table>')
  const arrival = $('td[class=arrival-delivery]').html().split('<br>')[2]
  return arrival
}

const PILResponseToContainers = (body) => {
  // Initialize
  let containers = []

  // Obtain container numbers
  const $ = cheerio.load('<table>' + body.data.containers + '</table>')
  $('td[class=container-num]').each( (i, elem) => {
    if (i != 0) { 
      let container = {}
      container[`${$(elem).text().split(' ')[0]}`] = {}
      containers.push(container)
    }
  })

  // Obtain container details
  let rawDetails = body.data.scheduleinfo.split('<br />')[2].split('<b>')[1].split('</b>')[0].split(' x ')
  if (parseInt(rawDetails[0]) != containers.length) { throw new Error('Containers are of different type. Unsure how to handle') }

  const sizeAndType = rawDetails[1]
  containers.forEach((c) => { c[Object.keys(c)[0]].sizeAndType = sizeAndType })

  return containers
}

module.exports = {
  PILResponseToData: PILResponseToData
}