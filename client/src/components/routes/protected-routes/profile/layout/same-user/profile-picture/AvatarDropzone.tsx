import { useState } from "react"
import { useDropzone } from "react-dropzone"
import StyledButton from "../../../../../../ui/StyledButton"
import cloudinaryAPI from "../../../../../../../lib/services/axios-instances/cloudinaryAPI"
import authAPI from "../../../../../../../lib/services/axios-instances/authAPI"
import { changeProfilePicture } from "../../../../../../../lib/store/slices/same-profile-slice/sameProfileSlice"
import { useDispatch } from "react-redux"
import { LinearProgress } from "@mui/material"

type Props = {
  firstName: string
  profilePicture: string | undefined
}

const AvatarDropzone = ({ firstName, profilePicture }: Props) => {
  const dispatch = useDispatch()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setSelectedFile(acceptedFiles[0])
    },
  })

  const handleSubmit = async () => {
    if (selectedFile) {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("upload_preset", "ugjfytls")

      try {
        const { data } = await cloudinaryAPI.post("/", formData)
        await authAPI.put("/change/user-details", {
          profilePicture: data.secure_url,
        })

        dispatch(changeProfilePicture(data.secure_url))
        setIsLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div className="space-y-16">
      <input {...getInputProps()} />
      <div
        className={`hover:bg-secondary border-secondary group relative flex h-96 w-96 cursor-pointer items-center justify-center rounded-full  border-4 caret-transparent duration-500 ${
          isDragActive ? "bg-tertiary border-dashed" : "bg-gray-500"
        }`}
        {...getRootProps()}
      >
        {selectedFile ? (
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Profile Picture"
            className="h-full w-full rounded-full object-cover duration-200 hover:opacity-50"
          />
        ) : profilePicture ? (
          <img
            src={profilePicture}
            alt="Profile Picture"
            className="h-full w-full rounded-full object-cover duration-200 hover:opacity-50"
          />
        ) : (
          <h1 className="select-none text-9xl capitalize text-gray-400 duration-200 hover:opacity-50">
            {firstName.charAt(0)}
          </h1>
        )}
      </div>
      <StyledButton
        buttonText="Set Profile Picture"
        onClick={handleSubmit}
        twClasses="w-full text-xl font-semibold bg-secondary text-tertiary border-2 border-secondary"
      />
      {isLoading && <LinearProgress />}
    </div>
  )
}

export default AvatarDropzone
