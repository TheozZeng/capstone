import { Col, Divider, message, Row } from 'antd'
import { useRouter } from 'next/router'
import Head from 'next/head'
import React from 'react'
import {
  ChangePasswordForm,
  ChangePasswordFormValue
} from '../../components/ChangePassword/ChangePasswordForm'
import { Layout } from '../../components/Layout'
import { useUser } from '../../components/Shared/UserContext'
import { changePassword } from '../../requests/auth.request'

export default function ChangePwdPage() {
  const router = useRouter()
  const { currentUser } = useUser()

  const onUpdate = (form: ChangePasswordFormValue) => {
    changePassword({ userId: currentUser._id, ...form })
      .then(() => {
        message.success('Password Updated')
        router.push('/')
      })
      .catch((err) => message.error(`Password Update Error: ${err.message}`))
  }

  return (
    <div>
      <Head>
        <link rel="icon" href="/logo-title.ico" type="image/x-icon" />
        <title>BT - Change Password</title>
      </Head>
      <Layout>
        <div className="section">
          <div>
            <Row justify="center" align="middle">
              <Col xs={24} sm={16} md={16} lg={8}>
                <h2>Update Password</h2>
                <Divider />
                <ChangePasswordForm onSubmit={onUpdate} />
              </Col>
            </Row>
          </div>
        </div>
      </Layout>
    </div>
  )
}
