import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined"
import { useState, useEffect } from "react"
import { TaskType } from "../../../../lib/types/primitive-types/TaskType"
import { useDispatch } from "react-redux"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PostType } from "../../../../lib/types/primitive-types/PostType"
import {
  deleteTask,
  updateTask,
} from "../../../../lib/store/slices/timeline-slice/timelineSlice"
import {
  updateTaskSchema,
  updateTaskType,
} from "../../../../../../common/validations/task/updateTaskValidator"
import ClickAwayListener from "@mui/material/ClickAwayListener"
import taskAPI from "../../../../lib/services/axios-instances/taskAPI"
import { setFeedback } from "../../../../lib/store/slices/feedback-slice/feedbackSlice"
import { isAxiosError } from "axios"
import ClearIcon from "@mui/icons-material/Clear"

type Props = {
  post: PostType
  task: TaskType
  isExpanded: boolean
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>
}
const TaskCell = ({ post, task, isExpanded, setIsExpanded }: Props) => {
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<updateTaskType>({
    resolver: zodResolver(updateTaskSchema),
  })

  const handleUpdateTask = async (formData: updateTaskType) => {
    try {
      const { data } = await taskAPI.put(
        `/?postId=${post._id}&taskId=${task._id}`,
        formData
      )
      dispatch(updateTask({ post, task: data.data }))
      dispatch(
        setFeedback({
          feedbackMessage: data.message,
          feedbackType: "success",
        })
      )
      setIsEditing(false)
      reset()
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
    }
  }

  const handleDeleteTask = async () => {
    try {
      const { data } = await taskAPI.delete(`/?taskId=${task._id}`)
      dispatch(deleteTask({ post, task }))
      dispatch(
        setFeedback({
          feedbackMessage: data.message,
          feedbackType: "success",
        })
      )
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
    }
  }

  useEffect(() => {
    if (isEditing) {
      setFocus("title")
    }
  }, [isEditing, setFocus])

  useEffect(() => {
    if (errors.title?.message && !isSubmitSuccessful) {
      dispatch(
        setFeedback({
          feedbackMessage: errors.title?.message,
          feedbackType: "error",
        })
      )
    }
  }, [errors.title?.message, isSubmitSuccessful, dispatch])

  return (
    <div className="flex-grow w-[45%] max-w-[45%] border border-secondary p-2 text-sm text-left cursor-pointer hover:bg-secondary hover:text-main duration-200 flex items-center">
      <ChevronRightOutlinedIcon
        onClick={() => setIsExpanded(!isExpanded)}
        className={`transform transition duration-200 ease-in-out ${
          isExpanded ? "rotate-90" : "rotate-0"
        }`}
      />

      {!isEditing ? (
        <div className="flex justify-between items-center w-full">
          <h1 onClick={() => setIsEditing(true)} className="h-full ">
            {task.title}
          </h1>
          <ClearIcon
            onClick={handleDeleteTask}
            className="rounded-full hover:bg-red-500 p-1 transition duration-200 ease-in-out"
          />
        </div>
      ) : (
        <ClickAwayListener onClickAway={() => setIsEditing(false)}>
          <form onSubmit={handleSubmit(handleUpdateTask)}>
            <input
              type="text"
              placeholder={task.title}
              className="bg-transparent h-full px-4 outline-none text-secondary rounded-md hover:border hover:border-secondary duration-200 ease-in-out hover:text-main hover:outline-tertiary"
              {...register("title")}
            />
          </form>
        </ClickAwayListener>
      )}
    </div>
  )
}

export default TaskCell
