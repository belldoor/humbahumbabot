import App from './app'
import NewsController from './news/news.controller'

const { PORT = 3000 } = process.env
const app = new App(
  [
    new NewsController()
  ],
  Number(PORT),
)

app.listen()
