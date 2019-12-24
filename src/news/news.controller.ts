import * as express from 'express'
import moment from 'moment'
import { logger } from '../util/logger'
import NewsProcessor from './news.processor'

interface INews {
  date: string
}

class NewsController {
  public router: express.Router = express.Router()
  private path: string = '/news'

  constructor() {
    this.intializeRoutes()
  }

  private intializeRoutes() {
    this.router.get(this.path, this.getDailyWFootBallNews)
    this.router.post(this.path, this.getCustomDateWFootBallNews)
  }

  private getDailyWFootBallNews = async (_request: express.Request, response: express.Response) => {
    const news = await this.fetchFootBallNews()

    response.send(news)
  }

  private getCustomDateWFootBallNews = async (request: express.Request, response: express.Response) => {
    const newsInfo: INews = request.body
    const news = await this.fetchFootBallNews(newsInfo.date)

    response.send(news)
  }

  private fetchFootBallNews = async (date?: string) => {
    const processor: NewsProcessor = new NewsProcessor()
    await processor.initialize()
    date = date || moment(new Date()).subtract(1, 'day').format('YYYYMMDD')

    if (!moment(date, 'YYYYMMDD', true).isValid()) {
      return {
        reason: 'Invalid date format!',
        result: false
      }
    }

    const news = await processor.getDailyWFootBallNews(date)
    logger.info(`Successfully crawled news count is ${news.length}.`)
    await processor.closeBrowser()

    return {
      data: news,
      result: true
    }
  }
}

export default NewsController
