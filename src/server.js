/* eslint-disable no-console */
import express from 'express'
import { env } from '~/config/environment'
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb'
import exitHook from 'async-exit-hook'
import { APIs_V1 } from '~/routes/v1'

const app = express()

const { APP_HOST: hostname, APP_PORT: port } = env

const START_SERVER = () => {
  app.use('/v1', APIs_V1)

  app.listen(port, hostname, () => {
    console.log(`Server is running at: ${hostname}:${port}/`)
  })

  exitHook(async () => {
    console.log('Exiting App')
    await CLOSE_DB()
  })
}

// có thể dùng cách (async () => {try {} catch {}})() (IIFE)
CONNECT_DB()
  .then(() => console.log('Connected to MongoDB Cloud Atlas'))
  .then(() => START_SERVER())
  .catch((err) => {
    console.error(err)
    process.exit(0)
  })
