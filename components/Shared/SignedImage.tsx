import { Image, ImageProps } from 'antd'
import { useEffect, useState } from 'react'
import { getPresignedGetUrl } from '../../requests/storage.request'

export const SignedImage = (props: ImageProps) => {
  const { src, fallback, ...rest } = props
  const [signedUrl, setSignedUrl] = useState<string>(src)

  useEffect(() => {
    if (src) {
      getPresignedGetUrl(src).then((res) => setSignedUrl(res.url))
    }
  }, [src])

  return <Image {...rest} src={signedUrl} fallback={fallback || '/block.png'} />
}
