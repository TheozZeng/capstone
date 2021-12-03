import { Button, Form, Input } from 'antd'
import { useRouter } from 'next/router'
import React from 'react'

export interface LoginFormValue {
  username: string
  password: string
}

export const LoginForm = (props: {
  onSubmit: (value: LoginFormValue) => void
}) => {
  const { onSubmit } = props
  const router = useRouter()

  return (
    <Form onFinish={onSubmit} layout="vertical">
      <Form.Item
        name="username"
        label="Username"
        rules={[
          {
            required: true,
            message: 'Please input your username!'
          }
        ]}
        hasFeedback
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Please input your password!'
          }
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Log In
        </Button>
        <Button
          onClick={() => {
            router.push('/register')
          }}
        >
          Register
        </Button>
      </Form.Item>
    </Form>
  )
}
