import { MongoDBDataAPI, Region } from 'mongodb-data-api'
import { MONGODB_API_KEY } from './constant'

const api = new MongoDBDataAPI({
  apiKey: MONGODB_API_KEY,
  appId: 'data-ozegu',
  region: Region.Virginia
})

export const databse = api.$cluster('Cluster').$database('readme')
