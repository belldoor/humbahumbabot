import { BASE_URL, MAX_NEWS_PAGE } from '../constants/constant'

describe('constant variables', () => {
  it('BASE_URL', () => {
    const baseUrl = 'https://sports.news.naver.com'
    expect(baseUrl).toBe(BASE_URL)
  })

  it('MAX_NEWS_PAGE', () => {
    const maxNewsPage = 2
    expect(maxNewsPage).toBe(MAX_NEWS_PAGE)
  })
})
