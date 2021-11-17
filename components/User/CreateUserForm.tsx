import { Button, Form, Input, Radio } from 'antd'
import React from 'react'

export interface CreateUserForm {
  username: string
  password: string
}

export const CreateUserForm = (props: {
  onSubmit: (value: CreateUserForm) => void
}) => {
  const { onSubmit } = props

  return (
    <Form onFinish={onSubmit} layout="vertical">
      <Form.Item
        name="username"
        label="Username"
        rules={[
          {
            required: true,
            message: 'Please input username!'
          }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Please input password!'
          },
          { min: 6 }
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="verifyPassword"
        label="Verify Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm password!'
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject(
                new Error('The two passwords that you entered do not match!')
              )
            }
          })
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
