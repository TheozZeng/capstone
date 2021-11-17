import { ChangePasswordFormValue } from '../components/ChangePassword/ChangePasswordForm'
import { TokenUser } from '../middleware/jwt'
import { AuthRes } from '../pages/api/auth'
import { client } from './client'

export const auth = (payload: { username: string; password: string }) =>
  client.post<AuthRes>('/auth', payload).then((res) => res.data)

export const token = () =>
  client.get<TokenUser>('/user/token').then((res) => res.data)

export const changePassword = (
  payload: ChangePasswordFormValue & { userId: string }
) =>
  client.post<AuthRes>('/user/change-password', payload).then((res) => res.data)
