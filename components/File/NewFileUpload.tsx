import { PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, message, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { exctractKeywordsMap } from '../../helpers/extract_keywords'
import { NewKeyword } from '../../model/keyword'
import { createFile } from '../../requests/file.request'
import { LinodeDragger } from '../Shared/LinodeDragger'
import { useUser } from '../Shared/UserContext'

export const NewFileUpload = (props: {
  options: {
    collegeId?: string
    courseId?: string
    topicId?: string
  }
  onSuccess?: () => void
}) => {
  const { options, onSuccess } = props
  const { currentUser } = useUser()

  const [form] = Form.useForm()

  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)

  const onSaveFile = async () => {
    const newFile = await form.validateFields()

    if (newFile) {
      if (options.collegeId && options.courseId && options.topicId) {
        setUploading(true)
        let keywords = []
        for (let i in newFile.documents) {
          const f = newFile.documents[i]
          if (
            f.type ===
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            f.type === 'text/plain'
          ) {
            const ks = await exctractKeywordsMap(
              f.originFileObj,
              f.response.url
            )
            keywords = keywords.concat(ks)
          }
        }
        console.log(keywords)
        createFile({
          file: {
            name: newFile.name,
            document: newFile.documents.map((d) => d.response),
            createdBy: currentUser._id,
            college: options.collegeId,
            course: options.courseId,
            topic: options.topicId
          },
          keywords
        }).then(() => {
          setUploading(false)
          setOpen(false)
          message.success('Yay! Contributed!')
          onSuccess()
        })
      } else {
        message.error('Please select a college and a course and a topic')
      }
    } else {
      message.error('Please fill in all the fields')
    }
  }

  return (
    <>
      <Button
        icon={<PlusOutlined />}
        size="large"
        onClick={() => {
          setOpen(true)
        }}
        type="primary"
      >
        Contribute
      </Button>
      <Modal
        title="Contribute"
        visible={open}
        onOk={onSaveFile}
        onCancel={() => {
          setOpen(false)
        }}
        confirmLoading={uploading}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" required>
            <Input />
          </Form.Item>
          <Form.Item
            name="documents"
            label="Document"
            required
            getValueFromEvent={(e) => e.fileList}
            valuePropName="fileList"
          >
            <LinodeDragger
              multiple
              folder={`documents/`}
              acl="public-read"
              onChange={async (info) => {
                setUploading(info.event ? true : false)
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
