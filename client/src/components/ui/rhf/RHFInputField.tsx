import { UseFormRegisterReturn } from "react-hook-form"

type Props = {
  label: string
  register: UseFormRegisterReturn
  error?: string
}

const RHFInputField = ({ label, register, error }: Props) => {
  return (
    <div className="relative my-5 w-full">
      <input
        type="text"
        className="peer h-10 w-full rounded-sm border-b-2 border-gray-300 bg-transparent py-2 text-gray-900 placeholder-transparent focus:border-tertiary focus:outline-none"
        placeholder=""
        id={register.name}
        {...register}
      />
      <label
        htmlFor={register.name}
        className="absolute -top-3.5 left-0  text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
      >
        {label}
      </label>
      <p className="min-h-[2em] text-xs font-semibold text-red-500">{error}</p>
    </div>
  )
}

export default RHFInputField