import { SendOutlined } from '@ant-design/icons'
import { Button, Form, Input, message } from 'antd'
import Head from 'next/head'
import React from 'react'
import { Layout } from '../components/Layout'

const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
};

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
  }
};

export default function UserFeedback() {

  const onFinish = (values) => {
    // TODO: write data to database
    message.success('Feedback Submitted! Thank you!')
  };

  return (
    <div>
      <Head>
        <title>User Feedback</title>
      </Head>

      <Layout>
        <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', minHeight: '10vh', padding: 20 }}>
          <h1>
            User Feedback
          </h1>
        </div>
        <div>
          <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
            <Form.Item
              name={['user', 'name']}
              label="Name"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={['user', 'email']}
              label="Email"
              rules={[
                {
                  required: true,
                  type: 'email',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item 
              name={['user', 'title']}
              label="Title"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input allowClear maxLength={150} />
            </Form.Item>
            <Form.Item name={['user', 'description']} label="Description">
              <Input.TextArea allowClear autoSize showCount maxLength={3000} />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 5 }}>
              <Button icon={<SendOutlined />} type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Layout>

    </div>
  )
}
