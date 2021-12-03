import { ICollege } from '../model/college'
import { CollegeListRes } from '../pages/api/college/list'
import { NewCollege } from '../pages/api/college/new'
import { client } from './client'

export interface CollegeQuery {
  keyword?: string
}

export const getColleges = (query?: CollegeQuery) =>
  client
    .get<CollegeListRes>('/college/list', { params: query })
    .then((res) => res.data)

export const getCollege = (id: string) =>
  client.get<ICollege>(`/college/${id}`).then((res) => res.data)

export const deleteCollege = (id: string) =>
  client.delete<ICollege>(`/college/${id}`).then((res) => res.data)

export const updateCollege = (id: string, payload: NewCollege) =>
  client.post<ICollege>(`/college/${id}`, payload).then((res) => res.data)

export const createCollege = (payload: NewCollege) =>
  client.post<ICollege>('/college/new', payload).then((res) => res.data)
