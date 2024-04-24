import { Observable } from 'rxjs';

export type DataGridProps<T> = {
  data: T[] | Observable<T[]>;
  sortable: boolean;
  pageSize: number | null;
};
