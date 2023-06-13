import { Component, Inject, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-clinvar-viewer',
  templateUrl: './clinvar-viewer.component.html',
  styleUrls: ['./clinvar-viewer.component.scss']
})
export class ClinvarViewerComponent  implements OnChanges {
  @Input() data: any;
  @ViewChild(MatSort) sort: MatSort;

  readonly CLINVAR_METRIC_MAP = {
  };

  unformattedData: any;
  clinvarData: any = [];
  displayedColumns: string[] = ['key', 'value'];
  dataSource: MatTableDataSource<any>;

  constructor() {}

  ngOnChanges() {
    if ( this.data ) {
      this.unformattedData = this.data;

      const keys = Object.keys(this.unformattedData);
      for ( let i = 0; i < keys.length; i++ ) {
        const key = this.CLINVAR_METRIC_MAP[keys[i]];
        this.clinvarData.push({'key': keys[i], 'value': this.unformattedData[keys[i]]});
      }
      this.dataSource = new MatTableDataSource(this.clinvarData);
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
