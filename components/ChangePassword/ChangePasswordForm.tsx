import { Button, Form, Input } from 'antd'
import React from 'react'

export interface ChangePasswordFormValue {
  oldPassword: string
  newPassword: string
}

export const ChangePasswordForm = (props: {
  onSubmit: (value: ChangePasswordFormValue) => void
}) => {
  const { onSubmit } = props

  return (
    <Form
      layout="vertical"
      onFinish={(
        values: ChangePasswordFormValue & { verifyPassword: string }
      ) => {
        const { oldPassword, newPassword, verifyPassword } = values
        onSubmit({ oldPassword, newPassword })
      }}
    >
      <Form.Item
        name="oldPassword"
        label="Old Password"
        rules={[
          {
            required: true,
            message: 'Please input your old password!'
          }
        ]}
        hasFeedback
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="newPassword"
        label="New Password"
        rules={[
          {
            required: true,
            message: 'Please input your password!'
          },
          { min: 6 }
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="verifyPassword"
        label="Verify Password"
        dependencies={['newPassword']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!'
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
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
