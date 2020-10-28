import _ from 'lodash'

import { MAX_NEWS_PAGE } from '../constants/constant'
import NewsProcessor from '../news/news.processor'
import { logger } from '../util/logger'

describe('NewsProcessor', () => {
  let processor: NewsProcessor

  beforeEach(async () => {
    processor = new NewsProcessor()
    await processor.initialize()
  })

  afterEach(async () => {
    await processor.closeBrowser()
  })

  it('getDailyWFootBallNews', async () => {
    const date = '20201015'
    const result = await processor.getDailyWFootBallNews(date)

    logger.info(`Successfully crawled news: ${result.length}.`)

    const newsPerPage = 20
    const maxNewsPage = MAX_NEWS_PAGE * newsPerPage

    expect(result.length).toBe(maxNewsPage)
  })
})
