import { IKeyword } from '../model/keyword'
import { client } from './client'

export interface KeywordQuery {
  keyword?: string
  pageIndex?: number
  pageSize?: number
}

export const autocompleteKeyword = (query?: { keyword?: string }) =>
  client
    .get<{ keywords: { keyname: string }[] }>('/keyword/autocomplete', {
      params: query
    })
    .then((res) => res.data)

export const keywordSearch = (query?: KeywordQuery) =>
  client
    .get<{
      pageInfo: { pageSize: number; pageIndex: number; total: number }
      documents: IKeyword[]
    }>('/keyword/search', { params: query })
    .then((res) => res.data)
