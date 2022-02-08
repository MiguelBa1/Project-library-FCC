const { Schema } = require('mongoose')

module.exports = new Schema({
  title: {
    type: String, 
    required: true
  },
  comments: {
    type: Array,
    default: [String]
  },
  commentcount: {
    type: Number,
    default: 0
  }
})
