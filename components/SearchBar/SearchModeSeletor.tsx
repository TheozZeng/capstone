import { Tabs } from 'antd'
import { useRouter } from 'next/router'
const { TabPane } = Tabs

export const SearchModeSelector = () => {
  const router = useRouter()
  return (
    <Tabs
      defaultActiveKey={router.pathname}
      onChange={(key) => {
        router.push(key)
      }}
    >
      <TabPane tab="Keyword Search" key="/keyword-search"></TabPane>
      <TabPane tab="Precise Search" key="/"></TabPane>
    </Tabs>
  )
}
