export interface CommunityUser {
  id: string
  name: string | null
  image: string | null
  bio: string | null
  website: string | null
  githubUrl: string | null
  twitterUrl: string | null
  createdAt: string
}

export interface ProjectListItem {
  id: string
  title: string
  description: string
  githubUrl: string | null
  demoUrl: string | null
  imageUrl: string | null
  track: string
  modules: string[]
  tags: string[]
  upvotes: number
  commentCount: number
  createdAt: string
  author: CommunityUser
  upvoted: boolean
}

export interface ProjectDetail extends ProjectListItem {
  updatedAt: string
  isOwner: boolean
}

export interface CommentReply {
  id: string
  body: string
  createdAt: string
  author: CommunityUser
}

export interface CommentItem extends CommentReply {
  replies: CommentReply[]
}

export interface CommunityStats {
  members: number
  projects: number
  comments: number
  lessonsCompleted: number
}
