import { IFile } from '../model/file'
import { FileListRes } from '../pages/api/file/topics-list'
import { NewFile, NewFilePayload } from '../pages/api/file/new'
import { client } from './client'

export interface FileQuery {
  keyword?: string
  college?: string
  course?: string
  topic?: string
  pageIndex?: number
  pageSize?: number
}

export interface FileTopicsQuery {
  topics?: string[]
  pageIndex?: number
  pageSize?: number
}

export const getFiles = (query?: FileQuery) =>
  client
    .get<FileListRes>('/file/list', { params: query })
    .then((res) => res.data)

export const getFilesByTopics = (query?: FileTopicsQuery) =>
  client.post<FileListRes>('/file/topics-list', query).then((res) => res.data)

export const getFile = (id: string) =>
  client.get<IFile>(`/file/${id}`).then((res) => res.data)

export const deleteFile = (id: string) =>
  client.delete<IFile>(`/file/${id}`).then((res) => res.data)

export const updateFile = (id: string, payload: NewFile) =>
  client.post<IFile>(`/file/${id}`, payload).then((res) => res.data)

export const createFile = (payload: NewFilePayload) =>
  client.post<IFile>('/file/new', payload).then((res) => res.data)
