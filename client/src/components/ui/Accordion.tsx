import React, { useState } from "react"

type Props = {
  title: string
  children: React.ReactNode
}

const Accordion = ({ title, children }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const openAccordionClasses =
    isOpen && "hover:text-tertiary duration-200 ease-in-out"

  const toggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div
      className={`bg-secondary text-main border-secondary group overflow-hidden rounded-md border border-opacity-30 p-2 ${openAccordionClasses}`}
    >
      <div
        className="flex cursor-pointer items-center justify-between px-4 py-3"
        onClick={toggleAccordion}
      >
        <h2 className="text-lg font-extrabold">{title}</h2>
        <svg
          className={`${
            isOpen ? "rotate-180 transform duration-300" : ""
          } h-7 w-7`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className={`${isOpen ? "max-h-screen" : "max-h-0"} overflow-hidden`}>
        <div className="px-4 py-3">{children}</div>
      </div>
    </div>
  )
}

export default Accordion
