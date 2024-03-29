import { useState } from "react"
import { Tab, Tabs } from "@mui/material"
import { useNavigate } from "react-router-dom"

const HomeNavigationTabs = () => {
  const navigate = useNavigate()
  const [value, setValue] = useState("timeline")

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const handleTimelineClick = () => {
    navigate("/timeline")
  }

  const handleWorkspaceClick = () => {
    navigate("/workspace")
  }

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
        value="timeline"
        label="Timeline"
        className={`text-md font-semibold ${
          value === "timeline" ? "text-tertiary" : "text-secondary"
        }`}
        onClick={handleTimelineClick}
      />
      <Tab
        value="workspace"
        label="Workspace"
        className={`text-md font-semibold ${
          value === "workspace" ? "text-tertiary" : "text-secondary"
        }`}
        onClick={handleWorkspaceClick}
      />
    </Tabs>
  )
}

export default HomeNavigationTabs
