import { useParams } from "react-router-dom"
import { useTypedSelector } from "../../../../../lib/hooks/redux-hook/useTypedSelector"
import Follower from "./Follower"
import Alert from "../../../../ui/mui/Alert"

const Followers = () => {
  const { username: currentUsername, followers: currentFollowers } =
    useTypedSelector((state) => state.sameProfile)
  const { followers: otherFollowers } = useTypedSelector(
    (state) => state.otherProfile
  )
  const { username: pathUsername } = useParams()
  const isSameUser = currentUsername === pathUsername

  const followers = isSameUser ? currentFollowers : otherFollowers

  return followers.length !== 0 ? (
    <ul className="w-full">
      {followers.map((follower) => (
        <Follower follower={follower} />
      ))}
    </ul>
  ) : (
    <div className="w-full">
      <Alert message="User has no followers" severity="error" />
    </div>
  )
}

export default Followers
