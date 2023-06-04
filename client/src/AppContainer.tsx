import React from "react"

type Props = {
  children: React.ReactNode
}

const AppContainer = ({ children }: Props) => {
  return (
    <div className="bg-blue-50 text-black tracking-tight overflow-x-hidden dark:bg-black dark:text-primary duration-700 ease-in-out">
      {children}
    </div>
  )
}

export default AppContainer