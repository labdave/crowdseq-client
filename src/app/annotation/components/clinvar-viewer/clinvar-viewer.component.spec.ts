import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinvarViewerComponent } from './clinvar-viewer.component';

describe('ClinvarViewerComponent', () => {
  let component: ClinvarViewerComponent;
  let fixture: ComponentFixture<ClinvarViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinvarViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinvarViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
