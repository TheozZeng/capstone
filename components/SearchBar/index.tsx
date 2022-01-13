import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { Button, Divider, Input, message, Row, Select, Space } from 'antd'
import React, { useState } from 'react'
import useSWR from 'swr'
import { createCollege, getColleges } from '../../requests/college.request'
import { createCourse, getCourses } from '../../requests/course.request'
import { createTopic, getTopics } from '../../requests/topic.request'

const { Option } = Select

export const SearchBar = (props: {
  onChange: (values: {
    collegeId?: string
    courseId?: string
    topicId?: string
  }) => void
}) => {
  const { onChange } = props
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

  return (
    <Row align="bottom">
      <div>
        <div className="mb-10 text-xl">College</div>
        <Select
          style={{ width: 200 }}
          size="large"
          value={collegeId}
          showSearch
          onSearch={(keyword) => setCollegeKeyword(keyword)}
          onChange={(e) => {
            setCollegeId(e)
            setCourseId(null)
            setTopicId(null)
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
      </div>

      <div>
        <div className="mb-10 text-xl">Course</div>
        <Select
          style={{ width: 200 }}
          size="large"
          value={courseId}
          onChange={(e) => {
            setCourseId(e)
            setTopicId(null)
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
      </div>

      <div>
        <div className="mb-10 text-xl">Topic</div>
        <Select
          style={{ width: 200 }}
          size="large"
          value={topicId}
          onChange={(e) => {
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
      </div>

      <Button
        onClick={() => {
          onChange({ collegeId, courseId, topicId })
        }}
        size="large"
        type="primary"
      >
        Search
      </Button>
    </Row>
  )
}
