import mongoose from "mongoose"

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const CommentSchema = new Schema(
  {
    body: {
      type: String,
      required: true,
    },
    commenterId: {
      type: ObjectId,
      ref: "User",
    },
    commenterUsername: {
      type: String,
      ref: "User",
    },
    postId: {
      type: ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true }
)

const CommentModel = mongoose.model("Comment", CommentSchema)

export default CommentModel
