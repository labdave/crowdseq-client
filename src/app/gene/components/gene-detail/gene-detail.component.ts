import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'src/app/shared/components/dialog/dialog.service';
import { GeneService } from '../../services/gene.service';
import { Variant } from '../../../variant/models/variant';

@Component({
  selector: 'app-gene-detail',
  templateUrl: './gene-detail.component.html',
  styleUrls: ['./gene-detail.component.scss']
})
export class GeneDetailComponent implements OnInit {

  geneSymbol: string;
  isLoading = false;
  isVariantsLoading = false;
  
  geneData: any;
  variantData: Variant[];


  constructor(private activatedRoute: ActivatedRoute,
              private service: GeneService,
              private dialogService: DialogService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.geneSymbol = params['symbol'];
    });

    this.loadGeneData(this.geneSymbol);
    this.loadGeneVariantData(this.geneSymbol);
  }

  loadGeneData(symbol: string) {
    this.isLoading = true;
    this.service.getGeneBySymbol(symbol).subscribe(
      data => {
        this.isLoading = false;
        this.geneData = data;       
      }, error => {
        this.isLoading = false;
        this.dialogService.alert('Error', 'There was an issue with retrieving the gene.', null, DialogService.error);
      }
    );
  }

  loadGeneVariantData(symbol: string) {
    this.isVariantsLoading = true;
    this.service.getGeneVariants(symbol).subscribe(
      data => {
        this.isVariantsLoading = false;
        if ( data ) {
          this.variantData = data;
        } else {
          this.variantData = [];
        }
        
      }, error => {
        this.isVariantsLoading = false;
        this.dialogService.alert('Error', 'There was an issue with retrieving the gene variants.', null, DialogService.error);
      }
    );
  }

}
