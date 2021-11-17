import axios, { AxiosInstance, AxiosResponse } from 'axios'

export const getToken = () => localStorage.getItem('_R_TOKEN')
export const setToken = (token: string) =>
  localStorage.setItem('_R_TOKEN', token)

const client = axios.create({
  baseURL: '/api'
})

client.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    return {
      ...config,
      headers: {
        ...config.headers,
        authorization: `Bearer ${token}`
      }
    }
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (err) => {
    if (err.response.status === 401) {
      setToken('')
      window.location.href = '/login'
    }
    return err.response ? Promise.reject(err.response.data) : err
  }
)

export { client }
