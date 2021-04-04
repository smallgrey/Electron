import logger from 'electron-log'
import { remote } from 'electron'

logger.transports.file.level = 'info'
logger.transports.file.maxSize = 1002430 // 10M
logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'
let date = new Date()
date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
logger.transports.file.file = remote.app.getPath('userData') + '\\test_electron_log\\app\\' + date + '.log'

export default {
  info (param) {
    logger.info(param)
  },
  warn (param) {
    logger.warn(param)
  },
  error (param) {
    logger.error(param)
  },
  debug (param) {
    logger.debug(param)
  },
  verbose (param) {
    logger.verbose(param)
  },
  silly (param) {
    logger.silly(param)
  }
}
