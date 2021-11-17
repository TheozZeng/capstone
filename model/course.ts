import { Document, Model, model, models, Schema } from 'mongoose'
import { ICollege } from './college'

export interface Course extends Document {
  name: string
  college: string
}

export interface ICourse {
  _id: string
  name: string
  college: ICollege
}

const courseSchema = new Schema(
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
    }
  },
  { timestamps: true }
)

export const CourseModel: Model<Course, {}> =
  models?.courses || model<Course>('courses', courseSchema)

export default CourseModel
