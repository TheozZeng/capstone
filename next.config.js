const withAntdLess = require('next-plugin-antd-less')
const { getThemeVariables } = require('antd/dist/theme')

/** @type {import('next').NextConfig} */
module.exports = withAntdLess({
  modifyVars: {
    ...getThemeVariables({
      compact: false // 开启紧凑模式,
    })
  }
})
