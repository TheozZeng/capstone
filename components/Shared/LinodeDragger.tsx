import { InboxOutlined } from '@ant-design/icons'
import { Typography, Upload } from 'antd'
import { LinkProps } from 'antd/lib/typography/Link'
import { DraggerProps, RcFile } from 'antd/lib/upload'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { S3_PUBLIC_READ } from '../../config/global'
import { getPublicUrl, getUniqueName } from '../../helpers/utils'
import {
  exposePublicGetUrl,
  getPresignedGetUrl,
  getPresignedPutUrl
} from '../../requests/storage.request'

const { Dragger } = Upload

export const SignedHref = (props: LinkProps) => {
  const { href, children, ...rest } = props
  const [signedUrl, setSignedUrl] = useState<string>(href)

  useEffect(() => {
    if (href) {
      getPresignedGetUrl(href).then((res) => setSignedUrl(res.url))
    }
  }, [href])

  return (
    <Typography.Link {...rest} href={signedUrl}>
      {children}
    </Typography.Link>
  )
}

export const LinodeDragger = (
  props: DraggerProps & { folder?: string; acl?: typeof S3_PUBLIC_READ }
) => {
  const { customRequest, itemRender, folder, acl, ...rest } = props

  return (
    <Dragger
      {...rest}
      itemRender={(node, file, fileList) => {
        return (
          <>
            {file.response?.acl === S3_PUBLIC_READ ? (
              <Typography.Link href={file.response?.url} target="_blank">
                {node}
              </Typography.Link>
            ) : (
              <SignedHref href={file.response?.url} target="_blank">
                {node}
              </SignedHref>
            )}
          </>
        )
      }}
      customRequest={(option) => {
        const { onProgress, onSuccess, onError } = option
        const file = option.file as RcFile
        const fileName = `${folder || ''}${getUniqueName(file.name)}`

        getPresignedPutUrl({ bucket: 'capstone', key: fileName }).then(
          (res) => {
            const signedPutUrl = res.url
            axios
              .put(signedPutUrl, file, {
                headers: { 'Content-Type': file.type },
                onUploadProgress: ({ total, loaded }) => {
                  onProgress({
                    percent: Math.round((loaded / total) * 100)
                  } as any)
                }
              })
              .then(async () => {
                if (acl === S3_PUBLIC_READ) {
                  const publicUrlRes = await exposePublicGetUrl({
                    bucket: 'capstone',
                    key: fileName,
                    signedUrl: signedPutUrl
                  })
                  onSuccess({ acl, url: publicUrlRes.url }, null)
                } else {
                  onSuccess({ acl, url: getPublicUrl(res.url) }, null)
                }
              })
              .catch(onError)
          }
        )
      }}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag files to this area to upload
      </p>
    </Dragger>
  )
}
