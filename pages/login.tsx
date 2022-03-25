import { Col, Divider, message, Row } from 'antd'
import { useRouter } from 'next/router'
import Head from 'next/head'
import React from 'react'
import { Layout } from '../components/Layout'
import { LoginForm, LoginFormValue } from '../components/Login/LoginForm'
import { auth } from '../requests/auth.request'
import { setToken } from '../requests/client'

export default function LoginPage() {
  const router = useRouter()

  const onLogin = (form: LoginFormValue) => {
    auth(form)
      .then((res) => {
        const { token } = res
        setToken(token)

        router.push('/')
      })
      .catch((err) => message.error(`Login Failed: ${err.message}`))
  }

  return (
    <div>
      <Head>
        <link rel="icon" href="/logo-title.ico" type="image/x-icon" />
        <title>BT - Login</title>
      </Head>
      <Layout>
        <div className="section">
          <div>
            <Row justify="center" align="middle">
              <Col xs={24} sm={16} md={16} lg={8}>
                <h2>Login</h2>
                <Divider />
                <LoginForm onSubmit={onLogin} />
              </Col>
            </Row>
          </div>
        </div>
      </Layout>
    </div>
  )
}
