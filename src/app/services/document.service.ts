import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Document } from '../models/document.model';
import { SERVER_URL } from 'environment/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  constructor(private http: HttpClient) {}

  getAllUserDocuments(id: string): Observable<Document[]> {
    return this.http.get<Document[]>(`${SERVER_URL}/documents/user/${id}`);
  }

  getDocument(id: string): Observable<Document> {
    return this.http.get<Document>(`${SERVER_URL}/documents/${id}`);
  }

  createDocument(document: Document): Observable<Document> {
    return this.http.post<Document>(`${SERVER_URL}/documents`, document);
  }

  updateDocument(document: Document): Observable<Document> {
    return this.http.put<Document>(
      `${SERVER_URL}/documents/${document._id}`,
      document
    );
  }
}
