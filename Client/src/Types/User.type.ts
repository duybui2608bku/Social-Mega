export interface UserType {
  _id: string
  name: string
  email: string
  date_of_birth: Date
  created_at: Date
  updated_at: Date
  verify: number
  bio: string
  location: string
  website: string
  avatar: string
  cover_photo: string
  status: number
}

export interface UserProfileAggregationsType {
  _id: string
  name: string
  avatar: string
}
