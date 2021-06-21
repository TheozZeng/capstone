const withAntdLess = require("next-plugin-antd-less");
const { getThemeVariables } = require("antd/dist/theme");
module.exports = withAntdLess({
  modifyVars: getThemeVariables({
    dark: false, // 开启暗黑模式
    compact: false, // 开启紧凑模式
  }),
  env: {},
});
