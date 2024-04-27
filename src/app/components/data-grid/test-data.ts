import { Observable, Observer } from 'rxjs';

export const normalTestData = [
  { id: 2, name: 'test2', position: 'not relevant' },
  { id: 3, name: 'test3', position: 'not relevant' },
  { id: 1, name: 'test1', position: 'not relevant' },
  { id: 4, name: 'test4', position: 'not relevant' },
  { id: 6, name: 'test6', position: 'not relevant' },
  { id: 5, name: 'test5', position: 'not relevant' },
];

function observerFunction(observer: Observer<typeof normalTestData>) {
  // synchronously deliver 1, 2, and 3, then completes
  observer.next(normalTestData.map((item) => ({ ...item })));

  setTimeout(() => {
    observer.next([{ name: 'test0', id: 0, position: 'not relevant' }]);
  }, 2000);

  // Return the unsubscribe function.
  // This one doesn't do anything
  // because values are delivered synchronously
  // and there is nothing to clean up.
  return { unsubscribe() {} };
}

export const observableTestData = new Observable(observerFunction);
