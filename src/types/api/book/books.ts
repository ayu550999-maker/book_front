import type { PageDomain, BaseEntity } from "../common";

/** 图书信息配置分页查询参数 */
export interface BooksQueryParams extends PageDomain {
  /** ISBN编号 */
  isbn?: string;
  /** 图书名称 */
  bookName?: string;
  /** 作者 */
  author?: string;
  /** 出版社ID */
  publisherId?: number;
  /** 分类ID */
  categoryId?: number;
  /** 出版日期 */
  publishDate?: string;
  /** 图书价格 */
  price?: string;
  /** 图书总数量 */
  totalNum?: number;
  /** 剩余可借数量 */
  remainNum?: number;
  /** 馆藏位置 */
  location?: string;
}

/** 图书信息配置信息 */
export interface Books extends BaseEntity {
  /** 图书ID */
  bookId?: number;
  /** ISBN编号 */
  isbn?: string;
  /** 图书名称 */
  bookName?: string;
  /** 作者 */
  author?: string;
  /** 出版社ID */
  publisherId?: number;
  /** 分类ID */
  categoryId?: number;
  /** 出版日期 */
  publishDate?: string;
  /** 图书价格 */
  price?: string;
  /** 图书总数量 */
  totalNum?: number;
  /** 剩余可借数量 */
  remainNum?: number;
  /** 馆藏位置 */
  location?: string;
}
