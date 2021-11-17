import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Hash } from '@aws-sdk/hash-node'
import { HttpRequest } from '@aws-sdk/protocol-http'
import { getSignedUrl, S3RequestPresigner } from '@aws-sdk/s3-request-presigner'
import { parseUrl } from '@aws-sdk/url-parser'
import { formatUrl } from '@aws-sdk/util-format-url'
import axios from 'axios'
import { S3_PUBLIC_READ } from '../config/global'
import { getPublicUrl } from '../helpers/utils'

const client = new S3Client({
  region: process.env.LINODE_REGION,
  endpoint: process.env.LINODE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.LINODE_ACCESS_KEY,
    secretAccessKey: process.env.LINODE_SECRET_KEY
  }
})

export const getPresignedPutUrl = async (bucket: string, key: string) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key
  })
  const url = await getSignedUrl(client, command, { expiresIn: 1800 })

  return url
}

export const exposeObjectAcl = async (
  signedUrl: string,
  bucket: string,
  key: string
) => {
  await axios.put(
    `${process.env.LINODE_API_ENDPOINT}/buckets/${process.env.LINODE_REGION}/${bucket}/object-acl`,
    { acl: S3_PUBLIC_READ, name: key },
    { headers: { Authorization: `Bearer ${process.env.LINODE_API_KEY}` } }
  )

  return getPublicUrl(signedUrl)
}

export const getPresignedGetUrl = async (url: string) => {
  const s3ObjectUrl = parseUrl(url)
  const presigner = new S3RequestPresigner({
    credentials: {
      accessKeyId: process.env.LINODE_ACCESS_KEY,
      secretAccessKey: process.env.LINODE_SECRET_KEY
    },
    region: process.env.LINODE_REGION,
    sha256: Hash.bind(null, 'sha256')
  })

  const getUrl = await presigner.presign(new HttpRequest(s3ObjectUrl), {
    expiresIn: 604800
  })

  return formatUrl(getUrl)
}
