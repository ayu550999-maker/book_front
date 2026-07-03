import request from '@/utils/request'
import type { AjaxResult, TableDataInfo, BooksQueryParams, Books } from '@/types'

// 查询图书信息列表
export function listBooks(query: BooksQueryParams): Promise<TableDataInfo<Books[]>> {
  return request({
    url: '/book/books/list',
    method: 'get',
    params: query
  })
}

// 查询图书信息详细
export function getBooks(bookId: number): Promise<AjaxResult<Books>> {
  return request({
    url: '/book/books/' + bookId,
    method: 'get'
  })
}

// 新增图书信息
export function addBooks(data: Books): Promise<AjaxResult> {
  return request({
    url: '/book/books',
    method: 'post',
    data: data
  })
}

// 修改图书信息
export function updateBooks(data: Books): Promise<AjaxResult> {
  return request({
    url: '/book/books',
    method: 'put',
    data: data
  })
}

// 删除图书信息
export function delBooks(bookId: number | number[]): Promise<AjaxResult> {
  return request({
    url: '/book/books/' + bookId,
    method: 'delete'
  })
}


