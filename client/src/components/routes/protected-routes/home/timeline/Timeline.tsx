import { useState } from "react"
import StyledButton from "../../../../ui/StyledButton"
import CreatePostInput from "../home-layout/CreatePostInput"
import TimelinePosts from "./TimelinePosts"
import { useTypedSelector } from "../../../../../lib/hooks/redux-hook/useTypedSelector"
import PostSkeletons from "../../../../ui/post/skeleton/PostSkeletons"
import SearchInput from "../home-layout/SearchInput"

const Timeline = () => {
  const { isLoading } = useTypedSelector((state) => state.timeline)
  const [isCreating, setIsCreating] = useState(false)

  const content = isLoading ? <PostSkeletons /> : <TimelinePosts />

  return (
    <div className="w-full space-y-10">
      <div className="flex items-center justify-between">
        <StyledButton
          buttonText={`${!isCreating ? "New Post" : "Cancel"}`}
          onClick={() => setIsCreating(!isCreating)}
        />
        <SearchInput />
      </div>
      {isCreating && <CreatePostInput setIsCreating={setIsCreating} />}
      {content}
    </div>
  )
}

export default Timeline
