import { Col, Divider, message, Row } from 'antd'
import { useRouter } from 'next/router'
import Head from 'next/head'
import React from 'react'
import { Layout } from '../components/Layout'
import { CreateUserForm } from '../components/User/CreateUserForm'
import { auth } from '../requests/auth.request'
import { setToken } from '../requests/client'
import { createUser } from '../requests/user.request'

export default function RegisterPage() {
  const router = useRouter()

  const onSubmit = (user: CreateUserForm) => {
    createUser(user)
      .then(() => {
        message.success('Registered')
        auth({ username: user.username, password: user.password })
          .then((res) => {
            const { token } = res
            setToken(token)

            router.push('/')
          })
          .catch((err) => message.error(`Login Faild: ${err.message}`))
      })
      .catch((err) => message.error(`User Create Error: ${err.message}`))
  }

  return (
    <div>
      <Head>
        <link rel="icon" href="/logo-title.ico" type="image/x-icon" />
        <title>BT - Register</title>
      </Head>
      <Layout>
        <div className="section">
          <div>
            <Row justify="center" align="middle">
              <Col xs={24} sm={16} md={16} lg={8}>
                <h2>Register</h2>
                <Divider />
                <CreateUserForm onSubmit={onSubmit} />
              </Col>
            </Row>
          </div>
        </div>
      </Layout>
    </div>
  )
}
