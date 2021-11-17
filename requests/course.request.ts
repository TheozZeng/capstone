import { ICourse } from '../model/course'
import { CourseListRes } from '../pages/api/course/list'
import { NewCourse } from '../pages/api/course/new'
import { client } from './client'

export interface CourseQuery {
  keyword?: string
  college?: string
}

export const getCourses = (query?: CourseQuery) =>
  client
    .get<CourseListRes>('/course/list', { params: query })
    .then((res) => res.data)

export const getCourse = (id: string) =>
  client.get<ICourse>(`/course/${id}`).then((res) => res.data)

export const deleteCourse = (id: string) =>
  client.delete<ICourse>(`/course/${id}`).then((res) => res.data)

export const updateCourse = (id: string, payload: NewCourse) =>
  client.post<ICourse>(`/course/${id}`, payload).then((res) => res.data)

export const createCourse = (payload: NewCourse) =>
  client.post<ICourse>('/course/new', payload).then((res) => res.data)
