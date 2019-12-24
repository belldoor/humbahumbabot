import winston from 'winston'

export const logger = winston.createLogger({
  exitOnError: false,
  format: winston.format.json(),
  levels: winston.config.npm.levels,
  transports: [
    new winston.transports.Console()
  ]
})
