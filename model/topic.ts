import { Document, Model, model, models, Schema } from 'mongoose'
import { ICollege } from './college'
import { ICourse } from './course'

export interface Topic extends Document {
  name: string
  college: string
  course: string
}

export interface ITopic {
  _id: string
  name: string
  college: ICollege
  course: ICourse
}

const topicSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true
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
    }
  },
  { timestamps: true }
)

export const TopicModel: Model<Topic, {}> =
  models?.topics || model<Topic>('topics', topicSchema)

export default TopicModel
