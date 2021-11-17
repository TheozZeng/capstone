import useSWR from 'swr'
import { getFiles } from '../../requests/file.request'
import { Divider, Image, Pagination } from 'antd'
import { Document, Page, pdfjs } from 'react-pdf'
import React, { useEffect, useState } from 'react'
import { DEFAULT_PAGESIZE } from '../../config/global'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

export const ContributedFileList = (props: {
  options: {
    collegeId?: string
    courseId?: string
    topicId?: string
  }
}) => {
  const { options } = props

  const [index, setIndex] = useState(1)
  const [size, setSize] = useState(DEFAULT_PAGESIZE)
  const [total, setTotal] = useState(0)

  const fileRes = useSWR(
    [options.collegeId, options.courseId, options.topicId, index, size],
    (collegeId, courseId, topicId, index, size) =>
      getFiles({
        college: collegeId,
        course: courseId,
        topic: topicId,
        pageIndex: index,
        pageSize: size
      })
  )

  useEffect(() => {
    if (!fileRes.isValidating && fileRes.data) {
      setTotal(fileRes.data.pageInfo.total)
    }
  }, [fileRes.isValidating])

  const documentRender = (fileUrl: string) => {
    switch (fileUrl.split('.').pop()) {
      case 'pdf':
        return <PDFWriter url={fileUrl} />
      default:
        return <Image src={fileUrl} alt="..." />
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
              borderRadius: 10,
              backgroundColor: '#1f1f1f',
              marginBottom: 10
            }}
          >
            <div style={{ fontSize: 20 }}>{file.name}</div>
            <Divider />
            <div>{documentRender(file.document[0].url)}</div>
          </div>
        )
      })}

      <Pagination
        current={index}
        total={total}
        pageSize={size}
        onChange={(page, pageSize) => {
          setIndex(page)
          setSize(pageSize)
        }}
        style={{ marginTop: 10 }}
      />
    </>
  )
}

const PDFWriter = (props: { url: string }) => {
  const { url } = props

  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log(numPages)
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
