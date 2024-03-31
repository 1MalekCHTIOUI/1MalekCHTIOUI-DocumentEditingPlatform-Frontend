import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import {
  Editor,
  NgxEditorComponent,
  Toolbar,
  Validators,
  schema,
  toHTML,
} from 'ngx-editor';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { startLoading, stopLoading } from 'src/app/store/actions/dash.action';
import { MessageService } from 'primeng/api';
import { SocketService } from 'src/app/services/socket.service';
import { selectUser } from 'src/app/store/selectors/auth.selector';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css'],
})
export class DocumentComponent implements OnInit, OnChanges, OnDestroy {
  @Input() document!: any;
  @Output() contributingUsers = new EventEmitter<string>();

  @ViewChild('editor') editorElement!: ElementRef<HTMLElement>;
  editor!: Editor;
  GlobalPramId: any;
  form!: FormGroup;
  constructor(
    private docService: DocumentService,
    private route: ActivatedRoute,
    private store: Store,
    private messageService: MessageService,
    private socketService: SocketService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['document'] && changes['document'].currentValue) {
      this.initForm();
      this.store.select(selectUser).subscribe((x) => {
        console.log('1- removing from: ' + this.GlobalPramId);
        this.socketService.userLeftDocument(x, this.GlobalPramId);
        this.GlobalPramId = this.route.snapshot.params['id'];
        if (this.route.snapshot.params['id']) {
          this.socketService.userConnected(x, this.GlobalPramId);
        }
        console.log('2- removing from: ' + this.GlobalPramId);
      });
    }
    this.messageService.clear();
  }

  ngOnInit(): void {
    this.store.select(selectUser).subscribe((x) => {
      // this.userConnected(x, this.document._id);
      this.userConnected(x, this.GlobalPramId);
    });

    this.editor = new Editor();
    this.initForm();

    this.form.get('editorContent')?.valueChanges.subscribe((value) => {
      console.log('changes');
      this.sendDocumentUpdate(value);
    });

    this.socketService.onUserConnected((data) => {
      console.log('emiting new data');

      this.contributingUsers.emit(data);
    });

    this.socketService.onDocumentUpdate(({ update, user }) => {
      console.log('Document update received:', update);
      if (typeof update === 'string') {
        this.form.get('editorContent')?.setValue(update, { emitEvent: false });
      } else {
        console.error('Invalid document update:', update);
      }
    });
  }

  initForm() {
    this.form = new FormGroup({
      editorContent: new FormControl(
        {
          value: this.document.content ? this.document.content : '',
          disabled: false,
        },
        Validators.required()
      ),
    });
  }

  userConnected(user: any, documentId: any) {
    this.socketService.userConnected(user, documentId);
  }

  sendDocumentUpdate(update: any): void {
    this.socketService.sendDocumentUpdate(update);
  }

  ngOnDestroy(): void {
    console.log('EXITING');

    this.editor.destroy();
    this.store.select(selectUser).subscribe((x) => {
      this.socketService.userLeftDocument(x, this.GlobalPramId);
    });
    this.GlobalPramId = null;
  }

  showToast(status: boolean, title: string, content: string): void {
    this.messageService.add({
      severity: status ? 'success' : 'error',
      summary: title,
      detail: content,
    });
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

  onSubmit() {
    if (this.form.valid) {
      this.route.params.subscribe((params) => {
        this.docService.getDocument(params['id']).subscribe((doc: Document) => {
          doc.content = this.form.value.editorContent || '';
          this.store.dispatch(startLoading());
          try {
            this.docService.updateDocument(doc).subscribe((doc: any) => {
              this.showToast(true, 'Success', 'Document updated successfully');
            });
          } catch (e: any) {
            console.log(e.message);
            this.showToast(false, 'Error', 'Document could not be updated');
          }
          this.store.dispatch(stopLoading());
        });
      });
    }
  }

  doBeforeUnload() {
    this.store.select(selectUser).subscribe((x) => {
      this.socketService.userLeftDocument(x, this.GlobalPramId);
    });
  }
}
