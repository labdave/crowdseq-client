import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { AnnotationDialogComponent } from 'src/app/annotation/components/annotation-dialog/annotation-dialog.component';
import { AnnovarCardComponent } from 'src/app/annotation/components/annovar-card/annovar-card.component';
import { ClinvarViewerComponent } from 'src/app/annotation/components/clinvar-viewer/clinvar-viewer.component';
import { Annotation } from 'src/app/annotation/models/annotation';
import { DialogService } from 'src/app/shared/components/dialog/dialog.service';

@Component({
  selector: 'app-variant-card',
  templateUrl: './variant-card.component.html',
  styleUrls: ['./variant-card.component.scss']
})
export class VariantCardComponent implements OnInit {
  @Input() data: any;

  annotation: Annotation;

  variant = null;
  chromPosRefAlt = null;

  aminoAcidList = [];
  selectedAAChange = null;
  selectedAAChangeId = null;

  variantAnnotationIndex = 0;
  variantAnnotationList = [];

  transcriptList = [];

  annotationTier = "";
  annotationTierSummary = "";

  showAminoAcidAnnotations = false;


  constructor(public dialog: MatDialog, private dialogService: DialogService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    if ( this.data ) {
      this.chromPosRefAlt = 'chr' + this.data.alt_chrom_pos_ref_alt.replace('-', ':').replace('-', ' ').replace('-', '>');
      if ( this.data.amino_acid_changes && this.data.amino_acid_changes.length > 0 ) {
        this.aminoAcidList = this.data.amino_acid_changes.sort((a, b) => (a.short_name.localeCompare(b.short_name, 'en', { numeric: true })));
        for (let i = 0; i < this.aminoAcidList.length; i++) {
          const aa = this.aminoAcidList[i];
          if (aa.transcript && aa.transcript.length > 0) {
            if (aa.transcript.findIndex(e => e.canonical === true) > -1) {
              this.selectedAAChangeId = aa.id;
              this.selectedAAChange = aa;
              break;
            }
          }
        }
        if (!this.selectedAAChange) {
          this.selectedAAChange = this.aminoAcidList[0];
          this.selectedAAChangeId = this.aminoAcidList[0].id;
        }
        
        // if ( this.selectedAAChange.transcripts && this.selectedAAChange.transcripts.length > 0 ) {
        //   if ( this.selectedAAChange.transcripts[0].lolliplot_tn_resource ) {
        //     this.lolliplotThumbnail = this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedAAChange.transcripts[0].lolliplot_tn_resource.signed_url);
        //     this.lolliplotData = this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedAAChange.transcripts[0].lolliplot_resource.signed_url);
        //   } else {
        //     this.lolliplotThumbnail = '';
        //     this.lolliplotData = '';
        //   }
        // } else {
        //   this.lolliplotThumbnail = '';
        //   this.lolliplotData = '';
        // }
      }
      if ( this.selectedAAChange ) {
        this.transcriptList = this.selectedAAChange.transcript.sort((a, b) => a.canonical === b.canonical ? 0 : a.canonical ? -1 : 1);
        this.variantAnnotationList = this.selectedAAChange.annotations.sort((a, b) => a.score < b.score || b.creation_timestamp.localeCompare(a.creation_timestamp));
        this.variantAnnotationIndex = 0;
        this.showAminoAcidAnnotations = this.variantAnnotationList.length > 0;
        this.updateAnnotationTier(null);
      } else {
        this.variantAnnotationIndex = 0;
        this.variantAnnotationList = [];
        this.showAminoAcidAnnotations = false;
      }
    }
  }

  updateAminoAcidSelection(event: any) {
    const list = this.aminoAcidList.reduce((a, o) => (o.id === this.selectedAAChangeId && a.push(o), a), []);
    this.selectedAAChange = list.length > 0 ? list[0] : null;
    if ( this.selectedAAChange ) {
      this.variantAnnotationList = this.selectedAAChange.annotations.sort((a, b) => a.score < b.score || b.creation_timestamp.localeCompare(a.creation_timestamp));
      this.variantAnnotationIndex = 0;
      this.showAminoAcidAnnotations = this.variantAnnotationList.length > 0;
      this.transcriptList = this.selectedAAChange.transcript.sort((a, b) => a.canonical === b.canonical ? 0 : a.canonical ? -1 : 1);
      if ( this.selectedAAChange.transcripts && this.selectedAAChange.transcripts.length > 0 ) {
        // if ( this.selectedAAChange.transcripts[0].lolliplot_tn_resource ) {
        //   this.lolliplotThumbnail = this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedAAChange.transcripts[0].lolliplot_tn_resource.signed_url);
        //   this.lolliplotData = this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedAAChange.transcripts[0].lolliplot_resource.signed_url);
        // } else {
        //   this.lolliplotThumbnail = '';
        //   this.lolliplotData = '';
        // }
      }
    } else {
      this.variantAnnotationIndex = 0;
      this.variantAnnotationList = [];
      this.showAminoAcidAnnotations = false;
    }
  }

  updateAnnotationTier(event: any) {
    const annotation = this.variantAnnotationList[this.variantAnnotationIndex];
    if ( annotation.tier ) {
      this.annotationTier = annotation.tier;
      this.annotationTierSummary = annotation.tier_summary;
    } else {
      this.annotationTier = "4";
      this.annotationTierSummary = "";
    }
  }

  updateVariantAnnotationList(event: any) {
    this.variantAnnotationList = this.selectedAAChange.annotations.sort((a, b) => a.score < b.score || b.creation_timestamp.localeCompare(a.creation_timestamp));
    this.variantAnnotationIndex = 0;
    this.showAminoAcidAnnotations = this.variantAnnotationList.length > 0;
  }

  editAnnotation() {
    const dialogRef = this.dialog.open(AnnotationDialogComponent, {
      width: '700px',
      height: '430px',
      data: {
        aminoAcidChange: this.selectedAAChange
      }
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dialogService.showSnackbar(
            'Annotation Saved',
            DialogService.medium,
            DialogService.success
          );
          if ( !this.selectedAAChange.annotations ) {
            this.selectedAAChange.annotations = [];
          }
          this.selectedAAChange.annotations.push(result);
          this.variantAnnotationList = this.selectedAAChange.annotations.sort((a, b) => a.score < b.score || b.creation_timestamp.localeCompare(a.creation_timestamp));
          this.variantAnnotationIndex = 0;
          this.showAminoAcidAnnotations = this.variantAnnotationList.length > 0;
          this.updateAnnotationTier(null);
        }
      }
    );
  }
}