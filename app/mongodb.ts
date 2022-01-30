import MongoDBDataAPI, { Region } from '../mda'
import { MONGODB_API_KEY } from './constant'

const mda = new MongoDBDataAPI({
  apiKey: MONGODB_API_KEY,
  // urlEndpoint: 'https://data.mongodb-api.com/app/data-ozegu/endpoint/data/beta'
  appId: 'data-ozegu',
  region: Region.Virginia
})

export const readmeDatabase = mda.$cluster('Cluster').$database('readme')
