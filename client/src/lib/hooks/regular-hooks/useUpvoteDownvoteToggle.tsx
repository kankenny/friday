import { useState } from "react"
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import ThumbDownIcon from "@mui/icons-material/ThumbDown"
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt"
import postAPI from "../../services/axios-instances/postAPI"
import { PostType } from "../../types/primitive-types/PostType"
import { useDispatch } from "react-redux"
import { updatePost } from "../../store/slices/timeline-slice/timelineSlice"
import { setFeedback } from "../../store/slices/feedback-slice/feedbackSlice"
import { isAxiosError } from "axios"

type Props = {
  post: PostType
  isAlreadyLiked: boolean
  isAlreadyDisliked: boolean
}

const useUpvoteDownvoteToggle = ({
  post,
  isAlreadyLiked,
  isAlreadyDisliked,
}: Props) => {
  const dispatch = useDispatch()
  const [isLiked, setIsLiked] = useState(isAlreadyLiked)
  const [isDisliked, setIsDisliked] = useState(isAlreadyDisliked)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)

  const handleLike = async () => {
    try {
      setIsButtonDisabled(true) // Disable the button
      if (!isLiked) {
        const { data } = await postAPI.put(`/${post._id}/upvote`)
        dispatch(
          setFeedback({
            feedbackMessage: data.message,
            feedbackType: "success",
          })
        )
        if (isDisliked) {
          const updatedPost = {
            ...post,
            downvotes: post.downvotes - 1,
            upvotes: post.upvotes + 1,
          }
          dispatch(updatePost(updatedPost))
        } else {
          const updatedPost = { ...post, upvotes: post.upvotes + 1 }
          dispatch(updatePost(updatedPost))
        }
      } else {
        const { data } = await postAPI.put(`/${post._id}/revert`)
        const updatedPost = { ...post, upvotes: post.upvotes - 1 }
        dispatch(updatePost(updatedPost))
        dispatch(
          setFeedback({
            feedbackMessage: data.message,
            feedbackType: "success",
          })
        )
      }
      setIsLiked(!isLiked)
      setIsDisliked(false)
    } catch (err) {
      if (isAxiosError(err)) {
        dispatch(
          setFeedback({
            feedbackMessage: err.response?.data.message,
            feedbackType: "error",
          })
        )
      } else {
        console.error(err)
      }
    } finally {
      setTimeout(() => {
        setIsButtonDisabled(false)
      }, 2000)
    }
  }

  const handleDislike = async () => {
    try {
      setIsButtonDisabled(true) // Disable the button
      if (!isDisliked) {
        const { data } = await postAPI.put(`/${post._id}/downvote`)
        dispatch(
          setFeedback({
            feedbackMessage: data.message,
            feedbackType: "success",
          })
        )
        if (isLiked) {
          const updatedPost = {
            ...post,
            upvotes: post.upvotes - 1,
            downvotes: post.downvotes + 1,
          }
          dispatch(updatePost(updatedPost))
        } else {
          const updatedPost = { ...post, downvotes: post.downvotes + 1 }
          dispatch(updatePost(updatedPost))
        }
      } else {
        const { data } = await postAPI.put(`/${post._id}/revert`)
        const updatedPost = { ...post, downvotes: post.downvotes - 1 }
        dispatch(updatePost(updatedPost))
        dispatch(
          setFeedback({
            feedbackMessage: data.message,
            feedbackType: "success",
          })
        )
      }
      setIsLiked(false)
      setIsDisliked(!isDisliked)
    } catch (err) {
      if (isAxiosError(err)) {
        dispatch(
          setFeedback({
            feedbackMessage: err.response?.data.message,
            feedbackType: "error",
          })
        )
      } else {
        console.error(err)
      }
    } finally {
      setTimeout(() => {
        setIsButtonDisabled(false)
      }, 2000)
    }
  }

  const UpvoteIcon = () => {
    if (isLiked) {
      return (
        <ThumbUpIcon
          onClick={handleLike}
          className={`hover:text-tertiary cursor-pointer duration-200 ease-in-out hover:scale-110 ${
            isButtonDisabled
              ? "pointer-events-none cursor-not-allowed opacity-50"
              : ""
          }`}
        />
      )
    } else {
      return (
        <ThumbUpOffAltIcon
          onClick={handleLike}
          className={`hover:text-tertiary cursor-pointer duration-200 ease-in-out hover:scale-110 ${
            isButtonDisabled
              ? "pointer-events-none cursor-not-allowed opacity-50"
              : ""
          }`}
        />
      )
    }
  }

  const DownvoteIcon = () => {
    if (isDisliked) {
      return (
        <ThumbDownIcon
          onClick={handleDislike}
          className={`hover:text-tertiary cursor-pointer duration-200 ease-in-out hover:scale-110 ${
            isButtonDisabled
              ? "pointer-events-none cursor-not-allowed opacity-50"
              : ""
          }`}
        />
      )
    } else {
      return (
        <ThumbDownOffAltIcon
          onClick={handleDislike}
          className={`hover:text-tertiary cursor-pointer duration-200 ease-in-out hover:scale-110 ${
            isButtonDisabled
              ? "pointer-events-none cursor-not-allowed opacity-50"
              : ""
          }`}
        />
      )
    }
  }

  return { UpvoteIcon, DownvoteIcon }
}

export default useUpvoteDownvoteToggle
