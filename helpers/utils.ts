import { basename, extname } from 'path'
import sanitize from 'sanitize-filename'
import { generate } from 'shortid'

const sanitizeFilename = (name: string): string => {
  return sanitize(name)
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase()
}

export const getUniqueName = (filename: string) => {
  const ext = extname(filename)
  const fileName = basename(filename, ext)
  const sanitizedFilename = sanitizeFilename(fileName)
  const uid = generate()
  return `${sanitizedFilename}_${uid}${ext}`
}

export const getPublicUrl = (presignedUrl: string) => {
  return presignedUrl.slice(0, presignedUrl.indexOf('?'))
}
