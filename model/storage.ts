import { Schema } from 'mongoose'
import { S3_PUBLIC_READ } from '../config/global'

export interface StorageUrl {
  acl?: typeof S3_PUBLIC_READ
  url: string
}
export const storageSchema = new Schema({
  acl: { type: String },
  url: { type: String, required: true }
})
