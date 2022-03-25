import { Divider, Row, Image } from 'antd'
import Head from 'next/head'
import React, { useState } from 'react'
import { ContributedFileList } from '../components/File/ContributedFileList'
import { NewFileUpload } from '../components/File/NewFileUpload'
import { Layout } from '../components/Layout'
import { SearchBar } from '../components/SearchBar'
import { SearchModeSelector } from '../components/SearchBar/SearchModeSelector'

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

  const [refresh, setRefresh] = useState(false)

  return (
    <div>
      <Head>
        <link rel="icon" href="/logo-title.ico" type="image/x-icon" />
        <title>Beyond Textbook</title>
      </Head>

      <Layout>
        <div style={{ minHeight: '100vh' }}>
          <Row
            justify="space-between"
            align="bottom"
            style={{
              padding: 20
            }}
          >
            <div>
              <SearchModeSelector />
              <SearchBar onChange={setSearchOpt} />
            </div>
            <NewFileUpload
              options={searchOpt}
              onSuccess={() => {
                setRefresh(true)
              }}
            />
          </Row>

          <Divider />

          <div
            style={{
              padding: 20
            }}
          >
            <ContributedFileList
              options={searchOpt}
              onRefresh={() => {
                setRefresh(false)
              }}
              refresh={refresh}
            />
          </div>
        </div>
      </Layout>
    </div>
  )
}
