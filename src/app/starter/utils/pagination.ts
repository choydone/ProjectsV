/**
 * 分页类
 */

export class Pagination {

  /**
   * 数据列表.
   */
  records: Array<any> = new Array<any>(0);

  /**
   * 数据总数.
   */
  total = 0;

  /**
   * 当前页.
   */
  current: any = 1;

  /**
   * 每页显示
   */
  size: any = 20;

  /**
   * 排序
   */
  orders: Array<any> = [];

  /**
   * 总页数
   */
  pages: any = 0;

  fill(data: any): void {
    this.pages = data.t.pages;
    this.total = data.t.total;
    this.orders = data.t.orders;
    this.records = data.t.records;
  }

  constructor(current: number = 1, size: number = 20) {
    this.current = current;
    this.size = size;
  }

  reset(): void {
    this.current = 1;
  }

  clear(): void {
    this.current = 1;
    this.pages = 0;
    this.total = 0;
    this.orders = [];
    this.records = [];
  }

  query(): {} {
    let query: any = {};
    query.current = this.current;
    query.size = this.size;
    return query;
  }
}


