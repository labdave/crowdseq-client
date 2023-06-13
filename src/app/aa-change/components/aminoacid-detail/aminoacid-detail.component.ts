import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Gene } from 'src/app/gene/models/gene';
import { DialogService } from 'src/app/shared/components/dialog/dialog.service';
import { AaChangeService } from '../../services/aa-change.service';
import { AminoAcidChange } from '../../models/amino-acid-change';

@Component({
  selector: 'app-aminoacid-detail',
  templateUrl: './aminoacid-detail.component.html',
  styleUrls: ['./aminoacid-detail.component.scss']
})
export class AminoacidDetailComponent implements OnInit {
  
  shortName: string;
  gene: string;
  isLoading = false;
  
  aaData: AminoAcidChange;
  geneData: any[];
  selectedGeneId: number;
  transcriptData: any[];

  constructor(private activatedRoute: ActivatedRoute,
    private service: AaChangeService,
    private dialogService: DialogService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.gene = params['gene'];
      this.shortName = params['shortName'];
    });

    this.loadAminoAcidData(this.gene, this.shortName);
  }

  selectedGeneChanged(event) {
    this.selectedGeneId = event;
  }

  loadAminoAcidData(gene: string, shortName: string) {
    this.isLoading = true;
    this.service.getAminoAcidByShortName(gene, shortName).subscribe(
      data => {
        this.isLoading = false;
        this.aaData = data;
        if ( data && data.genes ) {
          this.geneData = data.genes;
        } 
        if ( data && data.transcripts ) {
          this.transcriptData = data.transcripts;
        }      
      }, error => {
        this.isLoading = false;
        this.dialogService.alert('Error', 'There was an issue with retrieving the amino acid change.', null, DialogService.error);
      }
    );
  }

}
