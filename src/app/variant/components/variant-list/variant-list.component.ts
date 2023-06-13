import { AfterViewInit, Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-variant-list',
  templateUrl: './variant-list.component.html',
  styleUrls: ['./variant-list.component.scss']
})
export class VariantListComponent implements AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() data: any;
  @Input() preferredGene: any;
  @Input() showTitle: boolean;

  resultsLength = 0;

  displayedColumns: string[] = ['chrom_pos_ref_alt', 'aa_changes', 'link'];
  dataSource: MatTableDataSource<any>;

  constructor() { }

  ngAfterViewInit(): void {
    if ( this.data ) {
        this.data.map(v => {
          if (v.aa_transcript_variants) {
            const unique = [...new Set(v.aa_transcript_variants.map(item => item.amino_acid.short_name))]
            v['aa_change_list'] = unique.join(',');
          } else {
            v['aa_change_list'] = '';
          }
        });
        this.dataSource = new MatTableDataSource(this.data);
        this.resultsLength = this.data.length;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'aa_changes': return item['aa_change_list'] || 'Ω';
            default: return item[property];
          }
        };

    } else {
      this.resultsLength = 0;
      this.dataSource = new MatTableDataSource();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
