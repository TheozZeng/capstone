import { AutoComplete, Input } from 'antd'
import React, { useState } from 'react'
import { autocompleteKeyword } from '../../requests/keyword.request'

export const SearchBarKeywordSearch = (props: {
  onChange: (keyword?: string) => void
}) => {
  const { onChange } = props

  const [keywordRes, setKeywordRes] = useState([])

  return (
    <AutoComplete
      style={{ width: '100%' }}
      options={keywordRes
        .filter((value, index, self) => {
          return self.indexOf(value) === index
        })
        .map((k) => ({ label: k, value: k }))}
      onSelect={onChange}
      onSearch={(value) => {
        autocompleteKeyword({ keyword: value }).then((res) => {
          setKeywordRes(res.keywords.map((k) => k.keyname))
        })
      }}
    >
      <Input.Search size="large" placeholder="input here" enterButton />
    </AutoComplete>
  )
}
