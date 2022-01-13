import { Document, Model, model, models, Schema } from 'mongoose'
import { ICollege } from './college'
import { ICourse } from './course'
import { storageSchema, StorageUrl } from './storage'
import { ITopic } from './topic'

export interface File extends Document {
  name: string
  likes: number
  createdBy: string
  college: string
  course: string
  topic: string
  document: [StorageUrl]
}

export interface IFile {
  _id: string
  name: string
  likes: number
  createdBy: string
  college: ICollege
  course: ICourse
  topic: ITopic
  document: [StorageUrl]
}

const fileSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    likes: {
      type: Number,
      default: 0
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users'
    },
    college: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'colleges'
    },
    course: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'courses'
    },
    topic: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'topics'
    },
    document: [storageSchema]
  },
  { timestamps: true }
)

export const FileModel: Model<File, {}> =
  models?.files || model<File>('files', fileSchema)

export default FileModel
