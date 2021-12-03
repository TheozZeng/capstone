import { client } from './client'

export const getPresignedPutUrl = (payload: { bucket: string; key: string }) =>
  client.post<{ url: string }>('/upload', payload).then((res) => res.data)

export const exposePublicGetUrl = (payload: {
  signedUrl: string
  bucket: string
  key: string
}) =>
  client
    .post<{ url: string }>('/upload/publicUrl', payload)
    .then((res) => res.data)

export const getPresignedGetUrl = (url: string) =>
  client
    .post<{ url: string }>('/signUrl', { url })
    .then((res) => res.data)
