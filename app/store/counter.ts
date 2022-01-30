import { databse } from '../database'
import { ICounter } from '../../schemas/counter'

export default async (guid: string, init: number = 0): Promise<ICounter> => {
  if (!guid) {
    throw new Error('Invalid GUID!')
  }

  if (typeof init !== 'number' || init < 0) {
    throw new Error(`Invalid init value "${init}"!`)
  }

  const counterCollection = databse.$collection<ICounter>('counter')

  // update
  const result = await counterCollection.updateOne({
    filter: { guid },
    update: { $inc: { value: 1 }, $set: { last_update: Date.now() } }
  })

  // or create if not exists
  if (result.modifiedCount === 0) {
    await counterCollection.insertOne({
      document: {
        guid,
        value: init,
        create_at: Date.now(),
        last_update: Date.now()
      }
    })
  }

  const data = await counterCollection.findOne<ICounter>({ filter: { guid } })

  return data.document!
}
