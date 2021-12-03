import { Row, Col } from 'antd'
import React, { ReactNode } from 'react'

export const FormWrapper = ({ children }: { children?: ReactNode }) => {
  return (
    <Row justify="start" align="middle">
      <Col xs={24} sm={24} md={12} lg={10}>
        {children}
      </Col>
    </Row>
  )
}
