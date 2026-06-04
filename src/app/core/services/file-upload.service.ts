import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import {
  FileType,
  UploadedFile
} from '../models/uploaded-file.model';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private readonly apiUrl = `${environment.apiBaseUrl}/files/upload`;

  constructor(private readonly http: HttpClient) { }

  upload(file: File,
    type: FileType): Observable<UploadedFile> {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('type', type);

    return this.http.post<UploadedFile>(this.apiUrl, formData);
  }
}