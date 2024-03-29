import { Link } from "react-router-dom"
import Avatar from "@mui/material/Avatar"
import Card from "../Card"
import { UserType } from "../../../lib/types/primitive-types/UserType"
import FollowAction from "./FollowAction"
import BlockAction from "./BlockAction"

type Props = {
  user: UserType
  toFollow?: boolean
}

const UserCard = ({ user, toFollow = true }: Props) => {
  const { firstName, lastName, profilePicture, username } = user

  return (
    <Card twClasses="flex items-center justify-between border border-secondary bg-blue-200 shadow-md p-2 md:p-4">
      <Link
        to={`/users/${username}/posts`}
        className="group flex items-center gap-2 md:gap-4"
      >
        <Avatar
          className="text-secondary cursor-pointer capitalize"
          src={profilePicture}
        >
          {profilePicture ? "" : firstName.charAt(0)}
        </Avatar>
        <div className="group-hover:text-tertiary cursor-pointer duration-200 ease-in-out">
          <h1 className="group-hover:underline">
            {firstName} {lastName}
          </h1>
          <p className="text-xs font-light text-gray-600">@ {username}</p>
        </div>
      </Link>
      {toFollow ? <FollowAction user={user} /> : <BlockAction user={user} />}
    </Card>
  )
}

export default UserCard
