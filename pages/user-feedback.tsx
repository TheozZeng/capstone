import { SendOutlined } from '@ant-design/icons'
import { Button, Form, Input, message } from 'antd'
import Head from 'next/head'
import React from 'react'
import { Layout } from '../components/Layout'
import { createUserFeedback } from '../requests/userFeedback.request'
import { useUser } from '../components/Shared/UserContext'

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
  const { currentUser } = useUser()
  const [form] = Form.useForm()

  const onFinish = (values) => {
    createUserFeedback({ 
      username: currentUser.username, 
      name: values.name, 
      email: values.email, 
      title: values.title, 
      description: values.description
    }).then(() => {
      message.success('Feedback Submitted! Thank you!')
      form.resetFields()
    })
  };

  return (
    <div>
      <Head>
        <link rel="icon" href="/logo-title.ico" type="image/x-icon" />
        <title>BT - User Feedback</title>
      </Head>

      <Layout>
        <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', minHeight: '10vh', padding: 20 }}>
          <h1>
            User Feedback
          </h1>
        </div>
        <div>
          <Form {...layout} form={form} name="userFeedbackForm" onFinish={onFinish} validateMessages={validateMessages}>
            <Form.Item
              name='name'
              label="Name"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input allowClear maxLength={100} />
            </Form.Item>
            <Form.Item
              name='email'
              label="Email"
              rules={[
                {
                  required: true,
                  type: 'email',
                },
              ]}
            >
              <Input allowClear maxLength={100} />
            </Form.Item>
            <Form.Item 
              name='title'
              label="Title"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input allowClear maxLength={150} />
            </Form.Item>
            <Form.Item 
              name='description' 
              label="Description"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.TextArea allowClear autoSize showCount maxLength={3000} />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 5 }}>
              <Button
                icon={<SendOutlined />}
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Layout>

    </div>
  )
}
