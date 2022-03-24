import { PlusOutlined } from '@ant-design/icons'
import { Button, Divider, Form, Input, message, Modal, Select, Space } from 'antd'
import React, { useState } from 'react'
import useSWR from 'swr'
import { exctractKeywordsMap } from '../../helpers/extract_keywords'
import { createCollege, getColleges } from '../../requests/college.request'
import { createCourse, getCourses } from '../../requests/course.request'
import { createTopic, getTopics } from '../../requests/topic.request'
import { createFile } from '../../requests/file.request'
import { LinodeDragger } from '../Shared/LinodeDragger'
import { useUser } from '../Shared/UserContext'

const { Option } = Select;

const validateMessages = {
  required: '${label} is required!'
};

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

  const [collegeKeyword, setCollegeKeyword] = useState('')
  const [collegeId, setCollegeId] = useState('')
  const [newCollegeName, setNewCollegeName] = useState('')

  const [courseKeyword, setCourseKeyword] = useState('')
  const [courseId, setCourseId] = useState('')
  const [newCourseName, setNewCourseName] = useState('')

  const [topicKeyword, setTopicKeyword] = useState('')
  const [topicId, setTopicId] = useState('')
  const [newTopicName, setNewTopicName] = useState('')

  const collegeRes = useSWR(
    [collegeKeyword],
    (keyword) => getColleges({ keyword }),
    { revalidateOnFocus: false }
  )

  const courseRes = useSWR(
    [courseKeyword, collegeId],
    (keyword, collegeId) =>
      collegeId && getCourses({ keyword, college: collegeId }),
    { revalidateOnFocus: false }
  )

  const topicRes = useSWR(
    [topicKeyword, collegeId, courseId],
    (keyword, collegeId, courseId) =>
      collegeId &&
      courseId &&
      getTopics({ keyword, college: collegeId, course: courseId }),
    { revalidateOnFocus: false }
  )

  const onCreateCollege = () => {
    createCollege({ name: newCollegeName }).then(() => {
      setNewCollegeName('')
      message.success('Create college successfully')
      collegeRes.revalidate()
    })
  }

  const onCreateCourse = () => {
    if (collegeId) {
      createCourse({ name: newCourseName, college: collegeId }).then(() => {
        setNewCourseName('')
        message.success('Create course successfully')
        courseRes.revalidate()
      })
    } else {
      message.error('Please select college first')
    }
  }

  const onCreateTopic = () => {
    if (collegeId && courseId) {
      createTopic({
        name: newTopicName,
        college: collegeId,
        course: courseId
      }).then(() => {
        setNewTopicName('')
        message.success('Create topic successfully')
        topicRes.revalidate()
      })
    } else {
      message.error('Please select college and course first')
    }
  }

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
          setCollegeId(options.collegeId)
          setCourseId(options.courseId)
          setTopicId(options.topicId)

          form.setFields([
            { name: "college", value: options.collegeId, errors: [] },
            { name: "course", value: options.courseId, errors: [] },
            { name: "topic", value: options.topicId, errors: [] },
            { name: "name", errors: [] },
            { name: "documents", errors: [] }
          ])
          
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
        <Form form={form} layout="vertical" validateMessages={validateMessages}>
          <Form.Item name="college" label="College" rules={[{ required: true }]}>
            <Select
              value={collegeId}
              showSearch
              onSearch={(keyword) => setCollegeKeyword(keyword)}
              onChange={(e) => {
                options.collegeId = e
                setCollegeId(e)
                setCourseId(null)
                setTopicId(null)
                form.setFieldsValue( { course: null, topic: null } )
              }}
              dropdownRender={(menu) => (
                <div>
                  {menu}
                  <Divider style={{ margin: '4px 0' }} />
                  <Space>
                    <Input
                      placeholder="College name"
                      value={newCollegeName}
                      onChange={(e) => setNewCollegeName(e.target.value)}
                    />
                    <Button icon={<PlusOutlined />} onClick={onCreateCollege} />
                  </Space>
                </div>
              )}
            >
              {collegeRes.data?.colleges?.map((item) => (
                <Option key={item._id} value={item._id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="course" label="Course" rules={[{ required: true }]}>
            <Select
              value={courseId}
              onChange={(e) => {
                options.courseId = e
                setCourseId(e)
                setTopicId(null)
                form.setFieldsValue( { topic: null } )
              }}
              showSearch
              onSearch={(keyword) => setCourseKeyword(keyword)}
              dropdownRender={(menu) => (
                <div>
                  {menu}
                  <Divider style={{ margin: '4px 0' }} />
                  <Space>
                    <Input
                      placeholder="Course name"
                      value={newCourseName}
                      onChange={(e) => setNewCourseName(e.target.value)}
                    />
                    <Button icon={<PlusOutlined />} onClick={onCreateCourse} />
                  </Space>
                </div>
              )}
            >
              {courseRes.data?.courses?.map((item) => (
                <Option key={item._id} value={item._id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="topic" label="Topic" rules={[{ required: true }]}>
            <Select
              value={topicId}
              onChange={(e) => {
                options.topicId = e
                setTopicId(e)
              }}
              showSearch
              onSearch={(keyword) => setTopicKeyword(keyword)}
              dropdownRender={(menu) => (
                <div>
                  {menu}
                  <Divider style={{ margin: '4px 0' }} />
                  <Space>
                    <Input
                      placeholder="Topic name"
                      value={newTopicName}
                      onChange={(e) => setNewTopicName(e.target.value)}
                    />
                    <Button icon={<PlusOutlined />} onClick={onCreateTopic} />
                  </Space>
                </div>
              )}
            >
              {topicRes.data?.topics?.map((item) => (
                <Option key={item._id} value={item._id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="name" label="File Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="documents"
            label="Document"
            required
            getValueFromEvent={(e) => e.fileList}
            valuePropName="fileList"
            extra="Only .docx/.txt files are eligible for smart keyword extraction"
            rules={[{ required: true }]}
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
