/* eslint-disable no-console */
import express from 'express'
import { env } from '~/config/environment'
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb'
import exitHook from 'async-exit-hook'

const app = express()

const { APP_HOST: hostname, APP_PORT: port } = env

const START_SERVER = () => {
  app.get('/', async (req, res) => {
    console.log(await GET_DB().listCollections().toArray())

    res.end('<h1>Hello World</h1>')
  })

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
