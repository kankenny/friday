// Dependencies
import { Response } from "express"

// Models
import PostModel from "../../../models/Post"
import UserModel from "../../../models/User"

// Types
import JWTRequest from "../../../lib/types/JWTRequestType"

export const revertUpvoteOrDownvote = async (
  req: JWTRequest,
  res: Response
) => {
  try {
    // Destructure payload from the request params
    const { postId } = req.params

    // Extract decoded token from verifyToken middleware
    const { _idFromToken } = req.user

    // Check if user exists
    const existingUser = await UserModel.findById(_idFromToken)
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "Invalid Credentials!", data: null, ok: false })
    }

    // Check if post exists
    const existingPost = await PostModel.findById(postId)
    if (!existingPost) {
      return res
        .status(400)
        .json({ message: "Post not found!", data: null, ok: false })
    }

    // Check if the user has upvoted or downvoted the post. If so, remove their downvote
    const hasAlreadyUpvoted = existingPost.upvotedBy.some((userId) =>
      userId.equals(existingUser._id)
    )
    const hasAlreadyDownvoted = existingPost.downvotedBy.some((userId) =>
      userId.equals(existingUser._id)
    )
    if (!hasAlreadyUpvoted && !hasAlreadyDownvoted) {
      return res.status(400).json({
        message: "You have not upvoted or downvoted this post!",
        data: null,
        ok: false,
      })
    }

    if (hasAlreadyUpvoted) {
      // Revert post upvote
      existingPost.upvotes -= 1
      existingPost.upvotedBy = existingPost.upvotedBy.filter(
        (upvotedUsers) => !upvotedUsers._id.equals(existingUser._id)
      )
      await existingPost.save()

      // Revert user's upvote
      existingUser.upvotedPosts = existingUser.upvotedPosts.filter(
        (upvotedPost) => !upvotedPost.equals(existingPost._id)
      )
      await existingUser.save()
    }

    if (hasAlreadyDownvoted) {
      // Revert post downvote
      existingPost.downvotes -= 1
      existingPost.downvotedBy = existingPost.downvotedBy.filter(
        (downvotedUsers) => !downvotedUsers._id.equals(existingUser._id)
      )
      await existingPost.save()

      // Revert user's downvote
      existingUser.upvotedPosts = existingUser.upvotedPosts.filter(
        (upvotedPost) => !upvotedPost.equals(existingPost._id)
      )
      await existingUser.save()
    }

    res.status(200).json({
      message: "Upvote/Downvote successfully reverted!",
      data: null,
      ok: true,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: `Internal Server Error!: ${error}`,
      data: null,
      ok: false,
    })
  }
}
