const fetch = require('node-fetch') // has to be older the v2.6.1
const { backEndUrl } = require('../config')
const { setQueryAndEndpoint, isDataValidJson } = require('../utils/helper')
const { logger } = require('../utils/logger')

const Fetch = async ({ req, res, endPoint, method, file, toReturnData = false }) => {
  const url = setQueryAndEndpoint(endPoint, req.query)
  let body
  if (method === 'POST') { body = JSON.stringify(req.body) }
  if (file) { body = file }
  try {
    // const headers = setRequestHeaders(req.cookies, req);
    const headers = { 'Content-Type': 'application/json' }
    const response = await fetch(`${backEndUrl}${url}`, { method, headers, body })
    let data = await response.text()
    if (isDataValidJson(data)) { data = JSON.parse(data) } // parse data
    else if (!isDataValidJson(data) && data) { logFetchError('Parse JSON error', req, data, url) } // php return html and errors

    if (file || toReturnData) { return data }

    return res.send({ data })
  } catch (error) {
    console.error(error.message)
    res.send({
      success: false
    })
  }
}

module.exports = Fetch
