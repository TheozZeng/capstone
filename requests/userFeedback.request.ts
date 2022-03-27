import { IUserFeedback } from '../model/userFeedback'
import { UserFeedbackListRes } from '../pages/api/userFeedback/list'
import { NewUserFeedback } from '../pages/api/userFeedback/new'
import { client } from './client'

export interface UserFeedbackQuery {
  keyword?: string
}

export const getUserFeedbacks = (query?: UserFeedbackQuery) =>
  client
    .get<UserFeedbackListRes>('/userFeedback/list', { params: query })
    .then((res) => res.data)

export const getUserFeedback = (id: string) =>
  client.get<IUserFeedback>(`/userFeedback/${id}`).then((res) => res.data)

export const deleteUserFeedback = (id: string) =>
  client.delete<IUserFeedback>(`/userFeedback/${id}`).then((res) => res.data)

export const updateUserFeedback = (id: string, payload: NewUserFeedback) =>
  client.post<IUserFeedback>(`/userFeedback/${id}`, payload).then((res) => res.data)

export const createUserFeedback = (payload: NewUserFeedback) =>
  client.post<IUserFeedback>('/userFeedback/new', payload).then((res) => res.data)
