// Dependencies
import { Request, Response } from "express"

// Models
import PostModel from "../models/Post"
import TaskModel from "../models/Task"

// Validators
import createTaskSchema from "../lib/validations/createTaskValidator"
import updateTaskProgressSchema from "../lib/validations/updateTaskProgressValidator"

export const getPostTasks = async (req: Request, res: Response) => {
  // Extract postId from the request query
  const postId = req.query.postId
  if (!postId) {
    return res
      .status(400)
      .json({ message: "Bad Request!", data: null, ok: false })
  }

  try {
    // Check for the existence of the post
    const existingPost = await PostModel.findById(postId)
    if (!existingPost) {
      return res
        .status(404)
        .json({ message: "Post not found!", data: null, ok: false })
    }

    // Check if there are tasks in the post
    const tasks = existingPost.tasks
    if (!tasks || tasks.length === 0) {
      return res
        .status(404)
        .json({ message: "No tasks found in the post!", data: null, ok: false })
    }

    res
      .status(200)
      .json({ message: "Tasks successfully fetched!", data: tasks, ok: true })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error, data: null, ok: false })
  }
}

export const createTask = async (req: Request, res: Response) => {
  // Extract postId from the request query
  const postId = req.query.postId
  if (!postId) {
    return res
      .status(400)
      .json({ message: "Bad Request!", data: null, ok: false })
  }

  // Validate body using the create task schema
  try {
    createTaskSchema.parse(req.body)
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      message: "Invalid register form data!",
      data: null,
      ok: false,
    })
  }

  // Extract payload from the body
  const { title } = req.body

  try {
    // Check for the existence of the post
    const existingPost = await PostModel.findById(postId)
    if (!existingPost) {
      return res
        .status(404)
        .json({ message: "Post not found!", data: null, ok: false })
    }

    // Create new task
    const newTask = new TaskModel({
      title,
      progress: "working on it",
      postId,
    })

    await newTask.save()

    res
      .status(200)
      .json({ message: "Tasks successfully created!", data: newTask, ok: true })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error, data: null, ok: false })
  }
}

export const changeTaskProgress = async (req: Request, res: Response) => {
  try {
    // Validate body using the update task progress schema
    updateTaskProgressSchema.parse(req.body)

    // Extract progress payload from the request body
    const { progress } = req.body

    // Check if post exists
    const postId = req.query.postId
    if (!postId) {
      return res.status(400).json({
        message: "Bad Request!",
        data: null,
        ok: false,
      })
    }

    const existingPost = await PostModel.findById(postId)
    if (!existingPost) {
      return res.status(404).json({
        message: "Post not found!",
        data: null,
        ok: false,
      })
    }

    // Check if task exists
    const taskId = req.query.taskId
    if (!taskId) {
      return res.status(400).json({
        message: "Bad Request!",
        data: null,
        ok: false,
      })
    }

    const existingTask = await TaskModel.findById(taskId)
    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found!",
        data: null,
        ok: false,
      })
    }

    // Update task progress
    existingTask.progress = progress
    await existingTask.save()

    res.status(200).json({
      message: "Task progress updated successfully!",
      data: existingTask,
      ok: true,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error",
      data: null,
      ok: false,
    })
  }
}
