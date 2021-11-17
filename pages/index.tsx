import { Col, Divider, Row } from 'antd'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { ContributedFileList } from '../components/File/ContributedFileList'
import { NewFileUpload } from '../components/File/NewFileUpload'
import { Layout } from '../components/Layout'
import { SearchBar } from '../components/SearchBar'

export default function Home() {
  const [searchOpt, setSearchOpt] = useState<{
    collegeId?: string
    courseId?: string
    topicId?: string
  }>({
    collegeId: undefined,
    courseId: undefined,
    topicId: undefined
  })

  useEffect(() => {
    console.log(searchOpt)
  }, [searchOpt])

  return (
    <div>
      <Head>
        <title>Home</title>
      </Head>
      <Layout>
        <div style={{ background: 'url(/background.jpeg)', height: '100vh' }}>
          <Row
            justify="center"
            align="bottom"
            style={{
              padding: 20,
              backdropFilter: 'blur(10px)'
            }}
          >
            <Col span={20}>
              <SearchBar onChange={setSearchOpt} />
            </Col>
            <Col span={4}>
              <NewFileUpload options={searchOpt} />
            </Col>
          </Row>

          <Divider />

          <div
            style={{
              padding: 20,
              backdropFilter: 'blur(10px)'
            }}
          >
            <ContributedFileList options={searchOpt} />
          </div>
        </div>
      </Layout>
    </div>
  )
}
