import type { AuthResponse, Subject, Topic, Challenge, Progress } from '../types'

const API = import.meta.env.VITE_API_URL || '/api'

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || 'Request failed')
  }
  return res.json()
}

export const api = {
  auth: {
    register: (body: { name: string; email: string; password: string }) =>
      request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body: { email: string; password: string }) =>
      request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  },
  subjects: {
    list: () => request<Subject[]>('/subjects'),
    byYear: (year: string) => request<Subject[]>(`/subjects/year/${year}`),
    get: (id: number) => request<Subject>(`/subjects/${id}`),
  },
  topics: {
    bySubject: (subjectId: number) => request<Topic[]>(`/topics/subject/${subjectId}`),
    get: (id: number) => request<Topic>(`/topics/${id}`),
  },
  challenges: {
    byTopic: (topicId: number) => request<Challenge[]>(`/challenges/topic/${topicId}`),
    get: (id: number) => request<Challenge>(`/challenges/${id}`),
  },
  progress: {
    submit: (challengeId: number, answer: string) =>
      request<{ progress: Progress; correct: boolean }>('/progress/submit', {
        method: 'POST',
        body: JSON.stringify({ challengeId, answer }),
      }),
    me: () => request<{ total: number; completed: number; totalScore: number; progress: Progress[] }>('/progress/me'),
    byTopic: (topicId: number) =>
      request<{ total: number; completed: number; totalScore: number; progress: Progress[] }>(
        `/progress/me/topic/${topicId}`,
      ),
  },
}
