// Dependencies
import { Request, Response } from "express"

// Models
import UserModel from "../../../models/User"

// Validators
import { forgotPasswordFormSchema } from "../../../../../common/validations/auth/forgotPasswordFormValidator"

export const getSecurityQuestion = async (req: Request, res: Response) => {
  // Validate body using the register form schema
  try {
    forgotPasswordFormSchema.parse(req.body)
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      message: "Invalid security question form data!",
      data: null,
      ok: false,
    })
  }
  // destructure the payload attached to the body
  const { usernameOrEmail } = req.body

  try {
    // Check if the user exists
    const existingUser = await UserModel.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    })
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "User does not exist!", data: null, ok: false })
    }

    res.status(200).json({
      message: "Security question successfully fetched!",
      data: {
        firstName: existingUser.firstName,
        username: existingUser.username,
        securityQuestion: existingUser.securityQuestion,
      },
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
