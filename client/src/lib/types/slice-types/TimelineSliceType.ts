import { PostType } from "../primitive-types/PostType"

export interface TimelineSliceType {
  posts: PostType[]
  isLoading: boolean
  queriedPosts: PostType[]
  didQuery: boolean
}
