import * as bodyParser from 'body-parser'
import express from 'express'

import { logger } from './util/logger'

class App {
  public app: express.Application
  public port: number

  constructor(controllers: any, port: number) {
    this.app = express()
    this.port = port

    this.initializeMiddlewares()
    this.initializeControllers(controllers)
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`App listening on the port ${this.port}`)
    })
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json())
  }

  private initializeControllers(controllers: any) {
    controllers.forEach((controller: any) => {
      this.app.use('/', controller.router)
    })
  }
}

export default App
