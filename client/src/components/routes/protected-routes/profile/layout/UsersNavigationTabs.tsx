import { useState, useEffect } from "react"
import { Tab, Tabs } from "@mui/material"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useTypedSelector } from "../../../../../lib/hooks/redux-hook/useTypedSelector"

const UsersNavigationTabs = () => {
  const navigate = useNavigate()
  const [value, setValue] = useState("followers")
  const { username: sameUserUsername } = useTypedSelector(
    (state) => state.sameProfile
  )
  const { username: otherUserUsername } = useTypedSelector(
    (state) => state.otherProfile
  )
  const { username: pathUsername } = useParams()
  const isSameUser = pathUsername === sameUserUsername

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const handleFollowersClick = () => {
    navigate(
      `/users/${isSameUser ? sameUserUsername : otherUserUsername}/followers`
    )
  }

  const handleFollowingClick = () => {
    navigate(
      `/users/${isSameUser ? sameUserUsername : otherUserUsername}/following`
    )
  }

  const handleBlockedClick = () => {
    navigate(
      `/users/${isSameUser ? sameUserUsername : otherUserUsername}/blocked`
    )
  }

  const { pathname } = useLocation()
  useEffect(() => {
    if (pathname.includes("followers")) setValue("followers")
    else if (pathname.includes("following")) setValue("following")
  }, [pathname])

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      TabIndicatorProps={{
        className: "bg-tertiary",
      }}
      className="border-b"
    >
      <Tab
        value="followers"
        label="followers"
        className={`text-md font-semibold ${
          value === "followers" ? "text-tertiary" : "text-secondary"
        }`}
        onClick={handleFollowersClick}
      />
      <Tab
        value="following"
        label="following"
        className={`text-md font-semibold ${
          value === "following" ? "text-tertiary" : "text-secondary"
        }`}
        onClick={handleFollowingClick}
      />
      {isSameUser && (
        <Tab
          value="blocked"
          label="blocked"
          className={`text-md font-semibold ${
            value === "blocked" ? "text-tertiary" : "text-secondary"
          }`}
          onClick={handleBlockedClick}
        />
      )}
    </Tabs>
  )
}

export default UsersNavigationTabs
