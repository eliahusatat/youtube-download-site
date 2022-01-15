
const setDecimalAmount = amount => {
  if (amount !== 0 && amount % 1 !== 0) { return +(Math.round(amount * 100) / 100).toFixed(2) }
  return amount
}

const queryParamsExtractor = query => Object.entries(query).map(param => `${param[0]}=${param[1]}`).join('&')

const setQueryAndEndpoint = (endPoint, queryObject) => {
  let query = ''
  if (Object.entries(queryObject).length !== 0 && queryObject.constructor === Object) { // if there is query object from client
    query = `${endPoint}?${encodeURI(queryParamsExtractor(queryObject))}`
  } else { query = endPoint }

  return query
}

const getRandomId = (length = 19) => (Math.random().toString(36) + Date.now().toString(36)).substr(2, length)

const getRandomNumber = () => Math.floor(Math.random() * 1000000000) + 1000000000

const getClientUrl = req => req.header('Origin').split('//')[1].split(':')[0]

const isDataValidJson = (data) => {
  try {
    const dataToParse = JSON.stringify(JSON.parse(data)) // deep clone
    JSON.parse(dataToParse)
  } catch (e) {
    return false
  }
  return true
}

module.exports = {
  setQueryAndEndpoint,
  getRandomId,
  getClientUrl,
  isDataValidJson,
  getRandomNumber,
  setDecimalAmount
}
