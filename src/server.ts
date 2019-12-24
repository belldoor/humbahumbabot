import App from './app'
import NewsController from './news/news.controller'

const SERVER_PORT: number = Number(process.env.SERVER_PORT) || 8080
const app = new App(
  [
    new NewsController(),
  ],
  SERVER_PORT,
)

app.listen()
