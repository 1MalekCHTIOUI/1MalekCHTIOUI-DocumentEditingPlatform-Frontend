import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Document } from 'src/app/models/document.model';
@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css'],
})
export class DocumentsComponent {
  @Input() docs: Document[] = [];

  constructor(private router: Router) {}

  openDocument(doc: Document): void {
    if (doc && doc._id) {
      this.router.navigate(['/dashboard/document', doc._id]);
    } else {
      console.error('Invalid document ID');
    }
  }

  addNewDocument(): void {
    // this.addNewDocumentEvent.emit();
  }
}
