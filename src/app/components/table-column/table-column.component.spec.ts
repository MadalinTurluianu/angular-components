import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableColumnComponent } from './table-column.component';

describe('TableColumnComponent', () => {
  let component: TableColumnComponent<Record<string, string | number>>;
  let fixture: ComponentFixture<
    TableColumnComponent<Record<string, string | number>>
  >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableColumnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableColumnComponent);
    component = fixture.componentInstance;
    component.name = 'Name';
    component.property = 'name';
    fixture.detectChanges();
  });

  it('should have the given name as text context', () => {
    expect(fixture.nativeElement.textContent.trim()).toEqual('Name');
  });
});
