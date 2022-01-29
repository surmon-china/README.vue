import mongodb from '../mongodb'
import { ICounter } from '../../schemas/counter'

export default async (guid: string, init: number = 0) => {
  if (!guid) {
    throw new Error('Invalid GUID!')
  }

  if (typeof init !== 'number' || init < 0) {
    throw new Error(`Invalid init value "${init}"!`)
  }

  const client = await mongodb
  const counterCollection = await client.db().collection<ICounter>('counter')

  const target = await counterCollection.findOneAndUpdate(
    { guid },
    { $inc: { value: 1 }, $set: { last_update: Date.now() } }
  )

  if (!target.value) {
    await counterCollection.insertOne({
      guid,
      value: init,
      create_at: Date.now(),
      last_update: Date.now()
    })
  }

  return await counterCollection.findOne({ guid })
}
