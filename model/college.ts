import { Document, Model, model, models, Schema } from 'mongoose'

export interface College extends Document {
  name: string
}

export interface ICollege {
  _id: string
  name: string
}

const collegeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true
    }
  },
  { timestamps: true }
)

export const CollegeModel: Model<College, {}> =
  models?.colleges || model<College>('colleges', collegeSchema)

export default CollegeModel
