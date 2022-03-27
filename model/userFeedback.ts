import { Document, Model, model, models, Schema } from 'mongoose'

export interface UserFeedback extends Document {
  username: string
  name: string
  email: string
  title: string
  description: string
}

export interface IUserFeedback {
  _id: string
  username: string
  name: string
  email: string
  title: string
  description: string
}

const userFeedbackSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
)

export const UserFeedbackModel: Model<UserFeedback, {}> =
  models?.userFeedback || model<UserFeedback>('userFeedback', userFeedbackSchema)

export default UserFeedbackModel
