export enum Direction {
  up = 'up',
  down = 'down',
}

export type SortChangeProps = { columnName: string; direction: Direction };

export type PaginationChangeProps = { currentPage: number; pageSize: number | null }