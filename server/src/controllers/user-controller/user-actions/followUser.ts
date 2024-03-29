// Dependencies
import { Response } from "express"
import mongoose from "mongoose"

// Models
import UserModel from "../../../models/User"

// Types
import JWTRequest from "../../../lib/types/JWTRequestType"

export const followUser = async (req: JWTRequest, res: Response) => {
  // Extract userId and followerId from request params
  const { userId, userToFollowId } = req.params

  // Check if appropriate payload is attached to the body
  if (!userId || !userToFollowId) {
    return res.status(400).json({
      message: "userId and userToFollowId params are required!",
      data: null,
      ok: false,
    })
  }

  // Check if follower is the followee
  const isTheSameUser = userId === userToFollowId
  if (isTheSameUser) {
    return res.status(400).json({
      message: "You cannot follow yourself!",
      data: null,
      ok: false,
    })
  }

  // Extract decoded token from verifyToken middleware
  const { _idFromToken } = req.user

  // Check if user has an id equal to the id from the token
  if (userId !== _idFromToken) {
    return res
      .status(400)
      .json({ message: "Invalid Credentials!", data: null, ok: false })
  }

  // Check if userId and followerId are valid ObjectIds
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(userToFollowId)
  ) {
    return res.status(400).json({
      message: "Invalid userId or followerId!",
      data: null,
      ok: false,
    })
  }

  try {
    // Check if user exists
    const existingFollower = await UserModel.findById(userId)
    if (!existingFollower) {
      return res
        .status(404)
        .json({ message: "Follower not found!", data: null, ok: false })
    }

    // Check if follower exists
    const existingUserToFollow = await UserModel.findById(userToFollowId)
    if (!existingUserToFollow) {
      return res
        .status(404)
        .json({ message: "User to follow not found!", data: null, ok: false })
    }

    // Check if the user is already followed by the follower
    if (existingFollower.following.includes(existingUserToFollow._id)) {
      return res.status(400).json({
        message: "User is already followed by the follower!",
        data: null,
        ok: false,
      })
    }

    // Check if the follower blocks the user to follow
    if (existingFollower.blocked.includes(existingUserToFollow._id)) {
      return res.status(400).json({
        message: "You cannot follow someone you are blocking!",
        data: null,
        ok: false,
      })
    }

    // Update user's followers and follower's following list
    existingFollower.following.push(existingUserToFollow._id)
    existingUserToFollow.followers.push(existingFollower._id)
    await existingFollower.save()
    await existingUserToFollow.save()

    res.status(200).json({
      message: "User successfully followed!",
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
