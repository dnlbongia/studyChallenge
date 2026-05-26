export interface User {
  id: number
  name: string
  email: string
  role: 'student' | 'admin'
}

export interface Subject {
  id: number
  name: string
  description: string
  image_url: string
  year: string
  topics?: Topic[]
}

export interface Topic {
  id: number
  title: string
  content_url: string
  order: number
  subject_id: number
  challenges?: Challenge[]
}

export interface Challenge {
  id: number
  content_url: string
  options: string[]
  correct_answer: string
  points: number
  type: 'multiple_choice' | 'true_false'
  topic_id: number
}

export interface Progress {
  id: number
  user_id: number
  challenge_id: number
  completed: boolean
  score: number
  challenge?: Challenge
}

export interface AuthResponse {
  token: string
  user: User
}
