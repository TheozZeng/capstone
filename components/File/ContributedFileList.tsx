import { CloudDownloadOutlined } from '@ant-design/icons'
import { Button, Divider, Image, Pagination, Row } from 'antd'
import axios from 'axios'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import React, { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import useSWR from 'swr'
import { DEFAULT_PAGESIZE } from '../../config/global'
import { getFiles } from '../../requests/file.request'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

export const ContributedFileList = (props: {
  options: {
    collegeId?: string
    courseId?: string
    topicId?: string
  }
  refresh?: boolean
  onRefresh?: () => void
}) => {
  const { options, refresh, onRefresh } = props

  const [index, setIndex] = useState(1)
  const [size, setSize] = useState(DEFAULT_PAGESIZE)
  const [total, setTotal] = useState(0)

  const fileRes = useSWR(
    [options.collegeId, options.courseId, options.topicId, index, size],
    (collegeId, courseId, topicId, index, size) =>
      getFiles({
        college: collegeId,
        course: courseId,
        topics: [topicId],
        pageIndex: index,
        pageSize: size
      }),
    { revalidateOnFocus: false }
  )

  useEffect(() => {
    if (refresh) {
      fileRes.revalidate().then(onRefresh)
    }
  }, [refresh])

  useEffect(() => {
    if (!fileRes.isValidating && fileRes.data) {
      setTotal(fileRes.data.pageInfo.total)
    }
  }, [fileRes.isValidating])

  const documentRender = (fileUrl: string) => {
    switch (fileUrl.split('.').pop()) {
      case 'pdf':
        return <PDFWriter url={fileUrl} />
      case 'docx':
        return (
          <iframe
            style={{ width: '100%', minHeight: '400px' }}
            src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
          ></iframe>
        )
      default:
        return <Image src={fileUrl} alt="..." />
    }
  }

  const onDownload = async (urls: string[]) => {
    const download = async (url: string) => {
      return await axios
        .get(url, {
          responseType: 'blob',
          headers: { 'Access-Control-Allow-Origin': '*' }
        })
        .then((res) => {
          return { name: url, blob: res.data }
        })
    }
    const contents = await Promise.all(urls.map((file) => download(file)))

    if (contents) {
      const zip = new JSZip()
      contents.forEach((c) => {
        zip.file(c.name.split('/').pop(), c.blob)
      })
      zip
        .generateAsync({ type: 'blob' })
        .then((zipFile) => saveAs(zipFile, 'compressed.zip'))
    }
  }

  return (
    <>
      {fileRes.data?.files.map((file) => {
        return (
          <div
            key={file._id}
            style={{
              padding: 10,
              boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
              borderRadius: 10,
              marginBottom: 10
            }}
          >
            <Row justify="space-between">
              <div style={{ fontSize: 20 }}>{file.name}</div>
              <Button
                onClick={() => onDownload(file.document.map((d) => d.url))}
                type="primary"
                size="large"
              >
                <CloudDownloadOutlined /> Download
              </Button>
            </Row>

            <Divider />
            <div>
              {file.document.map((d) => (
                <div key={d.url}>{documentRender(d.url)}</div>
              ))}
            </div>
          </div>
        )
      })}

      <div
        style={{
          padding: 10,
          borderRadius: 10,
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
        }}
      >
        <Pagination
          current={index}
          total={total}
          pageSize={size}
          onChange={(page, pageSize) => {
            setIndex(page)
            setSize(pageSize)
          }}
        />
      </div>
    </>
  )
}

const PDFWriter = (props: { url: string }) => {
  const { url } = props

  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  return (
    <div>
      <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>

      <Pagination
        simple
        current={pageNumber}
        total={numPages}
        pageSize={1}
        onChange={(page) => {
          setPageNumber(page)
        }}
        style={{ marginTop: 10 }}
      />
    </div>
  )
}
