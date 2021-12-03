import mongoose from 'mongoose'
require('../model/college')
require('../model/user')
require('../model/course')
require('../model/topic')
require('../model/file')

const connectDB = (handler) => async (req, res) => {
  if (mongoose.connection.readyState) {
    return handler(req, res)
  }
  await mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true
  })
  return handler(req, res)
}

export default connectDB
