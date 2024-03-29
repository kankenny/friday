// Hooks
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

// Components
import RHFInputField from "../../../ui/rhf/RHFInputField"

// Services
import authAPI from "../../../../lib/services/axios-instances/authAPI"
import { isAxiosError } from "axios"

// Validators
import { zodResolver } from "@hookform/resolvers/zod"
import {
  forgotPasswordFormSchema,
  forgotPasswordFormType,
} from "../../../../../../common/validations/auth/forgotPasswordFormValidator"

const ForgotPasswordForm = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<forgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordFormSchema),
  })

  useEffect(() => {
    setFocus("usernameOrEmail")
  }, [setFocus])

  const getSecurityQuestionHandler = async (
    formData: forgotPasswordFormType
  ) => {
    try {
      const { data } = await authAPI.post("/get-security-question", formData)

      navigate("/security-answer", {
        state: {
          firstName: data.data.firstName,
          username: data.data.username,
          securityQuestion: data.data.securityQuestion,
        },
      })
    } catch (err) {
      if (isAxiosError(err)) {
        navigate("/login")
        return
      }
    }
  }

  return (
    <div className="p-10">
      <form
        className="flex flex-col"
        onSubmit={handleSubmit(getSecurityQuestionHandler)}
      >
        <h1 className="mb-10 text-center text-sm">
          Please enter the username or email that is associated with your
          account
        </h1>
        <RHFInputField
          label="Username or Email"
          register={register("usernameOrEmail")}
          error={errors.usernameOrEmail?.message}
        />
        <SubmitButton />
      </form>
    </div>
  )
}

export default ForgotPasswordForm

const SubmitButton = () => {
  return (
    <button
      className={`hover:bg-secondary bg-tertiary text-secondary hover:text-main dark:bg-secondary dark:hover:bg-tertiary mt-4 w-full rounded-lg p-4 text-sm font-bold duration-200 ease-in-out`}
      type="submit"
    >
      Submit
    </button>
  )
}
