const withLess = require("@zeit/next-less");

module.exports = withLess({
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  reactStrictMode: true,
  webpack5: false,
});
