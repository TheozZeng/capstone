import { ITopic } from '../model/topic'
import { TopicListRes } from '../pages/api/topic/list'
import { NewTopic } from '../pages/api/topic/new'
import { client } from './client'

export interface TopicQuery {
  keyword?: string
  college?: string
  course?: string
}

export const getTopics = (query?: TopicQuery) =>
  client
    .get<TopicListRes>('/topic/list', { params: query })
    .then((res) => res.data)

export const getTopic = (id: string) =>
  client.get<ITopic>(`/topic/${id}`).then((res) => res.data)

export const deleteTopic = (id: string) =>
  client.delete<ITopic>(`/topic/${id}`).then((res) => res.data)

export const updateTopic = (id: string, payload: NewTopic) =>
  client.post<ITopic>(`/topic/${id}`, payload).then((res) => res.data)

export const createTopic = (payload: NewTopic) =>
  client.post<ITopic>('/topic/new', payload).then((res) => res.data)
