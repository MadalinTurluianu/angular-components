export enum Direction {
  decreasing = 'decreasing',
  increasing = 'increasing',
}

export type SortChangeProps = { columnName: string; direction: Direction };

export type PaginationChangeProps = { currentPage: number; pageSize: number | null }