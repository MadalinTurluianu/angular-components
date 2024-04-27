import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { DataGridComponent } from './data-grid.component';
import { normalTestData, observableTestData } from './test-data';
import { TableColumnComponent } from '../table-column/table-column.component';
import { QueryList } from '@angular/core';

type DataItem = Record<string, string | number>;

const mockedColumn1 = new TableColumnComponent<DataItem>();
mockedColumn1.name = 'ID';
mockedColumn1.property = 'id';

const mockedColumn2 = new TableColumnComponent<DataItem>();
mockedColumn2.name = 'Name';
mockedColumn2.property = 'name';
mockedColumn2.sortable = false;

describe('DataGridComponent', () => {
  let component: DataGridComponent<DataItem>;
  let fixture: ComponentFixture<DataGridComponent<DataItem>>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [DataGridComponent, TableColumnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataGridComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    component.tableColumns = [mockedColumn1, mockedColumn2];
    component.data = normalTestData;
    component.sortable = true;
    component.pageSize = 2;
    component.ngOnInit();
    component.ngAfterViewInit();
  }));

  // class tests

  it('when the component was just created data and sorted data should be the same', () => {
    expect(component.sortedData).toEqual(normalTestData);
  });

  it('when the component was just created shown data should be the same as data or part of it depending on the page size', () => {
    expect(component.shownData).toEqual(
      normalTestData.slice(0, component.pageSize ?? component.sortedData.length)
    );
  });

  it('goNextPage should increase the current page by 1', () => {
    component.goNextPage();
    expect(component.page).toEqual(2);
  });

  it('goPreviousPage should increase the current page by 1', () => {
    component.page = 3;
    component.goPreviousPage();
    expect(component.page).toEqual(2);
  });

  it('sortData should sort in an increasing order if used once', () => {
    component.sortData('id', true);
    expect(component.sortedData[0]['id']).toEqual(1);
  });

  it('sortData should sort in an decreased order if used twice', () => {
    component.sortData('id', true);
    component.sortData('id', true);
    expect(component.sortedData[0]['id']).toEqual(6);
  });

  it('sortData should not sort if the component is not sortable', () => {
    component.sortable = false;
    component.sortData('id', true);
    expect(component.sortedData[0]['id']).toEqual(2);
  });

  // ui tests

  it('should create the table', () => {
    const table = fixture.nativeElement.querySelector('[data-testid=table]');
    expect(table).toBeTruthy();
  });

  it('should create the page size input', () => {
    const table = fixture.nativeElement.querySelector(
      '[data-testid=page-size]'
    );
    expect(table).toBeTruthy();
  });

  it('should create the page navigator', () => {
    const table = fixture.nativeElement.querySelector(
      '[data-testid=page-navigator]'
    );
    expect(table).toBeTruthy();
  });

  it('should have as many table headers as t-column added', () => {
    const headers = fixture.nativeElement.querySelectorAll(
      '[data-testid=header]'
    );
    expect(headers.length).toEqual(2);
  });

  it('should have columns just for the added t-column', () => {
    component.decreasePageSize();
    fixture.detectChanges();

    const cells = fixture.nativeElement.querySelectorAll('[data-testid=cell]');
    expect(cells.length).toEqual(2);
  });

  it('should have as many rows as page size or as items in the data list', () => {
    const rows = fixture.nativeElement.querySelectorAll('[data-testid=row]');
    expect(rows.length).toEqual(2);
  });

  it('should show the next page when clicking the next button', () => {
    component.goNextPage();
    fixture.detectChanges();

    const cells = fixture.nativeElement.querySelectorAll(
      '[data-testid=cell]'
    ) as QueryList<HTMLElement>;

    expect(cells.length).toEqual(4);
    expect(Array.from(cells)[0].textContent?.trim()).toEqual('1');
  });

  it('should show the previous page when clicking the previous button', () => {
    component.page = 3;
    component.goPreviousPage();
    fixture.detectChanges();

    const cells = fixture.nativeElement.querySelectorAll(
      '[data-testid=cell]'
    ) as QueryList<HTMLElement>;

    expect(cells.length).toEqual(4);
    expect(Array.from(cells)[0].textContent?.trim()).toEqual('1');
  });

  it('should not show the next button if the current page is the last', () => {
    component.goNextPage();
    component.goNextPage();
    fixture.detectChanges();

    const nextButton =
      fixture.nativeElement.querySelector('[data-testid=next]');

    expect(nextButton).toBeFalsy();
  });

  it('should not show the previous button if the current page is the first', () => {
    const previousButton = fixture.nativeElement.querySelector(
      '[data-testid=previous]'
    );

    expect(previousButton).toBeFalsy();
  });

  it('should sort the list in an increasing order when the header is first clicked', () => {
    const firstHeaderButton = fixture.nativeElement.querySelector(
      '[data-testid=header-button]'
    ) as HTMLButtonElement;

    firstHeaderButton.click();
    fixture.detectChanges();

    const firstCell = fixture.nativeElement.querySelector(
      '[data-testid=cell]'
    ) as HTMLElement;

    expect(firstCell.textContent?.trim()).toEqual('1');
  });

  it('should sort the list in an opposite order when the same header is pressed again after being clicked', () => {
    const firstHeaderButton = fixture.nativeElement.querySelector(
      '[data-testid=header-button]'
    ) as HTMLButtonElement;

    firstHeaderButton.click();
    firstHeaderButton.click();
    fixture.detectChanges();

    const firstCell = fixture.nativeElement.querySelector(
      '[data-testid=cell]'
    ) as HTMLElement;

    expect(firstCell.textContent?.trim()).toEqual('6');
  });
  it('should work with Observable data', fakeAsync(() => {
    component.data = observableTestData;
    component.pageSize = 2;
    component.ngOnInit();
    component.ngAfterViewInit();
    fixture.detectChanges();

    const firstCell = fixture.nativeElement.querySelector(
      '[data-testid=cell]'
    ) as HTMLElement;

    expect(firstCell.textContent?.trim()).toEqual('2');

    tick(201);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const firstCell = fixture.nativeElement.querySelector(
        '[data-testid=cell]'
      ) as HTMLElement;

      expect(firstCell.textContent?.trim()).toEqual('0');
    });
  }));
});
