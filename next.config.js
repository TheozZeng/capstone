const withAntdLess = require('next-plugin-antd-less')
const { getThemeVariables } = require('antd/dist/theme')

/** @type {import('next').NextConfig} */
module.exports = withAntdLess({
  modifyVars: {
    ...getThemeVariables({
      dark: true, // 开启暗黑模式
      compact: false // 开启紧凑模式,
    }),
    '@border-radius-base': '10px'
  }
})
