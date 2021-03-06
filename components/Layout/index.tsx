import { CommentOutlined, DownOutlined } from '@ant-design/icons'
import { Button, Col, Dropdown, Image, Layout as AntdLayout, Menu, Row } from 'antd'
import { useRouter } from 'next/router'
import React, { ReactNode, useEffect } from 'react'
import { token } from '../../requests/auth.request'
import { getToken, setToken } from '../../requests/client'
import { defaultUser, useUser } from '../Shared/UserContext'

const { Content, Header } = AntdLayout

export const Layout = (props: { children: ReactNode }) => {
  const router = useRouter()

  const { children } = props
  const { currentUser, setCurrentUser } = useUser()

  const onLogout = () => {
    setToken('')
    setCurrentUser(defaultUser)
    router.push('/login')
  }

  const unAuthRoutes = ['/login', '/register']

  useEffect(() => {
    if (!getToken()) {
      if (!unAuthRoutes.includes(router.pathname)) {
        router.push('/login')
      }
    } else if (!currentUser._id) {
      token().then(setCurrentUser)
    }
  }, [])

  const Settings = (
    <Dropdown
      trigger={['click']}
      overlay={
        <Menu>
          <Menu.Item
            onClick={() => {
              router.push('/settings/change-password')
            }}
          >
            Password
          </Menu.Item>
          <Menu.Item onClick={onLogout}>Logout</Menu.Item>
        </Menu>
      }
    >
      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        {currentUser.username} <DownOutlined />
      </a>
    </Dropdown>
  )

  return (
    <AntdLayout>
      <Header>
        <Row justify="space-between">
          <Col>
           <div>
            <Button 
              type="primary" 
              htmlType="submit"
              icon={<CommentOutlined />}
              onClick={() => {
                router.push('/user-feedback')
              }}
            >
              Feedback
            </Button>
           </div>
          </Col>
          <Col>
            <div
              style={{
                textAlign: 'center',
                cursor: 'pointer',
                fontSize: 30,
                color: 'white',
              }}
              onClick={() => {
                router.push('/')
              }}
            >
              <Image preview={false} height={40} src="/logo-small.png" style={{ position: 'relative', top: 7, right: 5 }} />
              <span> Beyond Textbook </span>
              <span style={{fontSize: 12}}>v1.0.4</span>
            </div>
          </Col>
          <Col>{currentUser._id && Settings}</Col>
        </Row>
      </Header>
      <Content className="content">{children}</Content>
    </AntdLayout>
  )
}
