import dayjs from "dayjs"
import { createLogger, format, transports } from "winston"
const { combine, timestamp, label, printf } = format

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} : ${level} : ${message}`
})

const logger = createLogger({
  format: combine(timestamp({ format: dayjs().format() }), customFormat),
  transports: [new transports.Console(), new transports.File({ filename: "combine.log" })],
})

export default logger
