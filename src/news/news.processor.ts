import _ from 'lodash'
import querystring from 'querystring'

import { BASE_URL, MAX_NEWS_PAGE } from '../constants/constant'
import { logger } from '../util/logger'

// tslint:disable-next-line: no-var-requires
const chromium = require('chrome-aws-lambda')

interface INewsResult {
  title: string
  href: string
}

class NewsProcessor {
  private path: string = '/wfootball/news/index.nhn?isphoto=N&view=text&type=popular'
  private selector: string = 'div#_newsList ul'
  private pageSelector: string = 'div#_pageList'
  private browser: any
  private page: any

  public getDailyWFootBallNews = async (date: string) => {
    await this.openPage()
    // Error: 400: Bad Request: message is too long
    // const maxPage = Number(await this.getPageCount(date, 1))
    logger.info(`${date}'s maxPage is ${MAX_NEWS_PAGE}, start crawling news headline from each pages.`)

    if (!Number.isInteger(MAX_NEWS_PAGE)) {
      throw new Error(`Invalid maxPage: ${MAX_NEWS_PAGE}`)
    }

    const result = []
    for (const page of _.range(1, MAX_NEWS_PAGE + 1)) {
      logger.info(`Current page: ${page}`)
      const currentHeadlines: [INewsResult] = await this.getPageHeadlines(date, page)
      result.push(currentHeadlines)
    }

    return _.flatten(result).map((news: INewsResult) => {
      news.href = BASE_URL + news.href
      return news
    })
  }

  public closeBrowser = async () => {
    logger.info(`Closing browser..`)
    await this.browser.close()
  }

  public async initialize() {
    logger.info('Initializing for puppeteer..')
    this.browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
    })
  }

  private getPageHeadlines = async (date: string, page: number): Promise<any> => {
    const url = `${BASE_URL}${this.path}`
    const opts = {
      date,
      page
    }
    await this.page.goto(`${url}&${querystring.encode(opts)}`)
    await this.page.waitForSelector(this.selector)

    const newsListHandle = await this.page.$(this.selector)
    const result: [INewsResult] = await newsListHandle.$$eval('.title', (nodes: any) => nodes.map((n: any) => {
      return {
        href: n.getAttribute('href'),
        title: n.innerText
      }
    }))

    return result
  }

  private getPageCount = async (date: string, page: number): Promise<any> => {
    const url = `${BASE_URL}${this.path}`
    const opts = {
      date,
      page
    }
    try {
      await this.page.goto(`${url}&${querystring.encode(opts)}`)
    } catch (e) {
      logger.error(e)
    }
    const pages: string[] = await this.findNext()
    if (pages.includes('다음')) {
      return await this.getPageCount(date, page + 10)
    } else {
      return pages[pages.length - 1]
    }
  }

  private findNext = async () => {
    await this.page.waitForSelector(this.pageSelector)
    const pageHandle = await this.page.$(this.pageSelector)
    const pages: string[] = await pageHandle.$$eval('strong, a', (nodes: any) => nodes.map((n: any) => n.innerText))
    return pages
  }

  private openPage = async () => {
    this.page = await this.browser.newPage()
  }
}

export default NewsProcessor
