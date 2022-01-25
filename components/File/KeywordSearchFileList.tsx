import { CloudDownloadOutlined } from '@ant-design/icons'
import { Image, Pagination, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import useSWR from 'swr'
import { DEFAULT_PAGESIZE } from '../../config/global'
import { keywordSearch } from '../../requests/keyword.request'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

export const KeywordSearchFileList = (props: { keyword?: string }) => {
  const { keyword } = props

  const [index, setIndex] = useState(1)
  const [size, setSize] = useState(DEFAULT_PAGESIZE)
  const [total, setTotal] = useState(0)

  const fileRes = useSWR(
    [keyword, index, size],
    (keyword, index, size) =>
      keywordSearch({
        keyword,
        pageIndex: index,
        pageSize: size
      }),
    { revalidateOnFocus: false }
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

  return (
    <>
      {fileRes.data?.documents.map((file) => {
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
              <a href={file.document} download className="text-lg">
                <CloudDownloadOutlined /> Download
              </a>
              <div>Score of revelancy: {file.score.toFixed(2)}</div>
            </Row>
            <div>{documentRender(file.document)}</div>
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
