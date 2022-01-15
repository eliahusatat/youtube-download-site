const wiki = require('wikipedia')
const { logger } = require('../utils/logger')

const search = async (req, res) => {
  try {
    const str = req.body.str
    const page = await wiki.page(str)
    if (req.body.option == 'page') {
      res.send({ success: true, page: page })
    } else if (req.body.option == 'summery') {
      const summary = await page.summary()
      res.send({ success: true, summary: summary })
    } else {
      res.send({ success: true, page: page })
    }
    logger.info({ message: { step: 'end', name: 'wikipedia', time: new Date() } })
    // const summary = await page.summary();
  } catch (error) {
    res.send({ success: false, error: e.message })
  }
}

module.exports = {
  search
}
