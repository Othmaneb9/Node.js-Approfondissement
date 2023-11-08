const { Schema, model } = require("mongoose");

const articleSchema = Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    minlength: 5,
  },
  content: {
    type: String,
    required: true,
  },
  user: {
     type: Schema.Types.ObjectId,
     ref: "User",
  },
  status: {
    type: String,
    enum: ['draft', 'published'], 
    default: 'draft', 
  },


});


const Article_model = model('Article', articleSchema);

module.exports = Article_model;
