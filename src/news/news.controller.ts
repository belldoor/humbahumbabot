import * as express from 'express'
import moment from 'moment'
import Telegraf from 'telegraf'
import { logger } from '../util/logger'
import NewsProcessor from './news.processor'

const BOT_TOKEN: string = process.env.BOT_TOKEN || 'my_secret'
const PERSONAL_CHAT_ID: string = process.env.PERSONAL_CHAT_ID || 'your_chat_id'

interface INews {
  date: string
}

class NewsController {
  public router: express.Router = express.Router()
  // HACK: RESTful형식에 맞는 url은 아니지만
  // AWS CloudWatch에서 Lambda 호출시 `/` 로 호출하므로..
  private path: string = '/'

  constructor() {
    this.intializeRoutes()
  }

  private intializeRoutes() {
    this.router.get(this.path, this.getDailyWFootBallNews)
    this.router.post(this.path, this.getCustomDateWFootBallNews)
  }

  private getDailyWFootBallNews = async (_request: express.Request, response: express.Response) => {
    const date = moment(new Date())
    let news = null

    try {
      news = await this.fetchFootBallNews(date.format('YYYYMMDD'))
    } catch (error) {
      return response.send(error)
    }

    const bot = new Telegraf(BOT_TOKEN)
    const weGoNorwich = 'This does not f****** slip now. Listen, Listen. This is gone. We go to Norwich. Exactly the same. We go again. Come on!'

    bot.start((ctx) => {
      // TODO: collect chatId at AWS S3 from new registered user
      ctx.reply(weGoNorwich)
      ctx.reply('어서와! 훔바훔바는 처음이지? 매일 오전 8시를 기다리라구! 흠허허')
    })

    const resultMessage = news.map((msg) => {
      return `- [${msg.title}](${msg.href})\n`
    }).join('')

    try {
      // HACK: Temporary using personal chatId
      const titleMessage = `${date.format('YYYY년 MM월 DD일')}의 인기 해외 축구 뉴스 TOP 60을 보여줄게~`
      bot.telegram.sendMessage(PERSONAL_CHAT_ID, titleMessage, { parse_mode: 'Markdown'})
      bot.telegram.sendMessage(PERSONAL_CHAT_ID, resultMessage, { parse_mode: 'Markdown'})
    } catch (error) {
      throw new Error(error)
    }

    await bot.launch()

    response.send(news)
  }

  private getCustomDateWFootBallNews = async (request: express.Request, response: express.Response) => {
    const newsInfo: INews = request.body
    let news = null
    try {
      news = await this.fetchFootBallNews(newsInfo.date)
    } catch (error) {
      return response.send(error)
    }

    return response.send(news)
  }

  private fetchFootBallNews = async (date: string) => {
    const processor: NewsProcessor = new NewsProcessor()
    await processor.initialize()

    if (!moment(date, 'YYYYMMDD', true).isValid()) {
      throw new Error('Invalid date format!')
    }

    let news = null
    try {
      news = await processor.getDailyWFootBallNews(date)
    } catch (error) {
      throw new Error(error)
    }

    logger.info(`Successfully crawled news count is ${news.length}.`)
    await processor.closeBrowser()

    return news
  }
}

export default NewsController
