import { Button, Col, Divider, Row, Select } from 'antd'
import axios from 'axios'
import FileSaver from 'file-saver'
import JSZip from 'jszip'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { KeywordSearchFileList } from '../components/File/KeywordSearchFileList'
import { Layout } from '../components/Layout'
import { SearchBarKeywordSearch } from '../components/SearchBar/SearchBarKeywordSearch'
import { SearchModeSelector } from '../components/SearchBar/SearchModeSelector'
import { StorageUrl } from '../model/storage'
import { ITopic } from '../model/topic'
import { getFiles } from '../requests/file.request'
import { getTopics } from '../requests/topic.request'

const { Option } = Select

export default function TextbookGen() {
  const [keyword, setKeyword] = useState<string>()
  const [topics, setTopics] = useState<ITopic[]>()
  const [topicIds, setTopicIds] = useState<string[]>()

  useEffect(() => {
    getTopics().then((topicsRes) => setTopics(topicsRes.topics))
  }, [])

  const searchTopics = (value: string) => {
    getTopics({ keyword: value }).then((topicsRes) =>
      setTopics(topicsRes.topics)
    )
  }

  const onDownload = async () => {
    const files = await getFiles({ topics: topicIds }).then(
      (fileRes) => fileRes.files
    )

    const documents = files.reduce(
      (res, acc) => (res = res.concat(acc.document)),
      [] as StorageUrl[]
    )

    const download = async (url: string) => {
      return await axios
        .get(url, {
          responseType: 'blob',
          headers: { 'Access-Control-Allow-Origin': '*' }
        })
        .then((res) => {
          return res.data
        })
        .catch((e) => console.log(e.message))
    }
    const downloadMany = async (files: string[]) => {
      return await Promise.all(files.map((file) => download(file)))
    }

    const exportZip = (blobs: Blob[]) => {
      const zip = JSZip()

      blobs.forEach((blob, i) => {
        zip.file(documents[i].url.replace('https://', ''), blob)
      })
      zip.generateAsync({ type: 'blob' }).then((zipFile) => {
        return FileSaver.saveAs(zipFile, `textbook-gen.zip`)
      })
    }

    exportZip(await downloadMany(documents.map((d) => d.url)))
  }

  return (
    <div>
      <Head>
        <link rel="icon" href="/logo-title.ico" type="image/x-icon" />
        <title>BT - Textbook Gen</title>
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
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Select topics"
                onSearch={searchTopics}
                value={topicIds}
                onChange={(_, values) =>
                  setTopicIds(values.map((v: { value: string }) => v.value))
                }
                allowClear
              >
                {topics?.map((topic) => (
                  <Option value={topic._id} key={topic._id}>
                    {topic.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Button onClick={onDownload} type="primary">
                Download
              </Button>
            </Col>
          </Row>

          <Divider />
        </div>
      </Layout>
    </div>
  )
}
