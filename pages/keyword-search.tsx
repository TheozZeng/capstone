import { Col, Divider, Row } from 'antd'
import Head from 'next/head'
import React, { useState } from 'react'
import { KeywordSearchFileList } from '../components/File/KeywordSearchFileList'
import { Layout } from '../components/Layout'
import { KeywordSeach } from '../components/SearchBar/KeywordSeach'
import { SearchModeSelector } from '../components/SearchBar/SearchModeSeletor'

export default function KeywordSearch() {
  const [keyword, setKeyword] = useState<string>()

  return (
    <div>
      <Head>
        <title>Keyword Search</title>
      </Head>

      <Layout>
        <div style={{ minHeight: '100vh' }}>
          <Row
            align="bottom"
            style={{
              padding: 20
            }}
          >
            <Col span={20}>
              <SearchModeSelector />
              <KeywordSeach onChange={setKeyword} />
            </Col>
            <Col span={4}>
              {/* <NewFileUpload
                options={searchOpt}
                onSuccess={() => {
                  setRefresh(true)
                }}
              /> */}
            </Col>
          </Row>

          <Divider />

          <div
            style={{
              padding: 20
            }}
          >
            <KeywordSearchFileList keyword={keyword} />
          </div>
        </div>
      </Layout>
    </div>
  )
}
