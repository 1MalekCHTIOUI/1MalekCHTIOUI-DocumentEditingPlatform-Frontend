import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Editor, Toolbar, Validators, schema, toHTML } from 'ngx-editor';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { startLoading, stopLoading } from 'src/app/store/actions/dash.action';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css'],
})
export class DocumentComponent {
  @Input() html!: any;
  editor!: Editor;

  constructor(
    private docService: DocumentService,
    private route: ActivatedRoute,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.editor = new Editor();
  }

  too() {
    return toHTML(this.html, schema);
  }
  // make sure to destory the editor
  ngOnDestroy(): void {
    this.editor.destroy();
  }

  get doc(): AbstractControl {
    const control = this.form.get('editorContent');
    if (!control) {
      throw new Error('editorContent control does not exist');
    }
    return control;
  }
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  form = new FormGroup({
    editorContent: new FormControl(
      { value: '', disabled: false },
      Validators.required()
    ),
  });

  onSubmit() {
    if (this.form.valid) {
      this.route.params.subscribe((params) => {
        this.docService.getDocument(params['id']).subscribe((doc: Document) => {
          doc.content = this.form.value.editorContent || '';
          this.store.dispatch(startLoading());
          setTimeout(() => {
            try {
              this.docService.updateDocument(doc);
            } catch (e: any) {
              console.log(e.message);
            }
            this.store.dispatch(stopLoading());
          }, 3000);
        });
      });
    }
  }
}
