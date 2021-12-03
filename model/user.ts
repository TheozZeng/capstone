import { Document, Model, model, models, Schema } from 'mongoose'

export interface User extends Document {
  username: string
  hash: string
}

export interface IUser {
  _id: string
  username: string
}

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    hash: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

export const UserModel: Model<User, {}> =
  models?.users || model<User>('users', userSchema)

export default UserModel
