import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AnnotationService } from '../../services/annotation.service';
import { DialogService } from 'src/app/shared/components/dialog/dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AAAnnotation } from '../../models/aa-annotation';
import { Annotation } from '../../models/annotation';
import { CKEditorComponent } from 'ng2-ckeditor';

@Component({
  selector: 'app-annotation-dialog',
  templateUrl: './annotation-dialog.component.html',
  styleUrls: ['./annotation-dialog.component.scss']
})
export class AnnotationDialogComponent {
  @ViewChild('ckEditor') ckEditor: CKEditorComponent;
  dialogTitle = 'Edit Annotation';
  isSaving = false;

  annotationForm: FormGroup;

  aminoAcidChange = null;
  currentAnnotation = null;

  ckEditorConfig: any = {};

  tierList = Annotation.TIER_LIST;
  showTier = false;


  constructor(
    public dialogRef: MatDialogRef<AnnotationDialogComponent>,
    private service: AnnotationService,
    private dialogService: DialogService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.annotationForm = this.fb.group({
      annotation: ['', Validators.required],
      tier: ['']
    });

    this.ckEditorConfig.removeButtons = 'Subscript,Superscript';
    this.ckEditorConfig.removePlugins = 'elementspath';
    this.ckEditorConfig.toolbar = [
      { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
      { name: 'paragraph', items: ['NumberedList', 'BulletedList'] },
      { name: 'links', items: ['Link', 'Unlink'] },
    ];
    this.ckEditorConfig.linkShowAdvancedTab = false;
    this.ckEditorConfig.linkShowTargetTab = false;
    this.ckEditorConfig.allowedContent = true;
    this.ckEditorConfig.resize_enabled = false;
    this.ckEditorConfig.defaultLangulage = 'en';
    this.ckEditorConfig.language = 'en';
    this.ckEditorConfig.height = '100%';

    CKEDITOR.on('dialogDefinition', function (ev) {
      ev.data.definition.resizable = CKEDITOR.DIALOG_RESIZE_NONE;
      try {
        /* this just gets the name of the dialog */
        var dialogName = ev.data.name;
        /* this just gets the contents of the opened dialog */
        var dialogDefinition = ev.data.definition;
        /* Make sure that the dialog opened is the link plugin ... otherwise do nothing */
        if (dialogName == 'link') {
          /* Getting the contents of the Target tab */
          var informationTab = dialogDefinition.getContents('target');
          /* Getting the contents of the dropdown field "Target" so we can set it */
          var targetField = informationTab.get('linkTargetType');
          /* Now that we have the field, we just set the default to _blank
          A good modification would be to check the value of the URL field
          and if the field does not start with "mailto:" or a relative path,
          then set the value to "_blank" */
          targetField['default'] = '_blank';
        }
      } catch (exception) {
        console.error('Error with target window');
      }
    });

    if ( data ) {

      if ( data.aminoAcidChange ) {
        this.aminoAcidChange = data.aminoAcidChange;
        this.dialogTitle = 'Edit Variant Annotation';
        this.annotationForm.controls.annotation.setValue('This variant is of unknown biological significance.');
      }

      if ( data.annotation ) {
        this.currentAnnotation = data.annotation;
        this.annotationForm.controls.annotation.setValue(this.currentAnnotation.annotation);
        if ( this.currentAnnotation.hasOwnProperty('amino_acid') ) {
          // editing variant annotation
          if ( data.annotation.tier ) {
            this.annotationForm.controls.tier.setValue(this.currentAnnotation.tier);
          }
          this.showTier = true;
          this.dialogTitle = 'Edit Variant Annotation';
        } else {
          // editing gene annotation
          this.dialogTitle = 'Edit Gene Annotation';
          
        }
      }
    }
  }


  saveAnnotation() {
    if ( this.annotationForm.valid ) {

      let newAnnotation = this.currentAnnotation ? this.currentAnnotation : new AAAnnotation();
      newAnnotation.annotation = this.annotationForm.value.annotation;
      newAnnotation.id = null;
      newAnnotation.creation_timestamp = null;
      newAnnotation.user = null;
      if ( newAnnotation.hasOwnProperty('tier')) {
        newAnnotation.tier = this.annotationForm.value.tier;
      }
      if ( this.aminoAcidChange ) {
        newAnnotation.score = 50;
        newAnnotation.priority = 50;
        newAnnotation.aa_change = [this.aminoAcidChange.id];
      }

      this.isSaving = true;
      this.service.saveAnnotation(newAnnotation).subscribe(
        data => {
          this.isSaving = false;
          if (data) {
            this.dialogRef.close(data);
          } else {
            this.dialogService.alert(
              'Save Error',
              'There was an issue saving the annotation.',
              null,
              DialogService.error
            );
            this.isSaving = false;
          }
        },
        error => {
          this.dialogService.alert(
            'Save Error',
            'There was an issue saving the annotation.',
            null,
            DialogService.error
          );
          this.isSaving = false;
        }
      );
    }
  }
}
