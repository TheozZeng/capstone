import { Document, Model, model, models, Schema } from 'mongoose'

export interface NewKeyword {
  keyname: string
  document: string
  score: number
}

export interface Keyword extends Document {
  keyname: string
  document: string
  score: number
}

export interface IKeyword {
  _id: string
  keyname: string
  document: string
  score: number
}

const keywordSchema = new Schema({
  keyname: {
    type: String,
    required: true
  },
  document: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    default: 0
  }
})

export const KeywordModel: Model<Keyword, {}> =
  models?.keywords || model<Keyword>('keywords', keywordSchema)

export default KeywordModel
