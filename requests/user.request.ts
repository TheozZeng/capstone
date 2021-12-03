import { CreateUserForm } from '../components/User/CreateUserForm'
import { IUser } from '../model/user'
import { client } from './client'

export const getUser = (id: string) =>
  client.get<IUser>(`/user/${id}`).then((res) => res.data)

export const createUser = (payload: CreateUserForm) =>
  client.post('/user/new', payload).then((res) => res.data)
