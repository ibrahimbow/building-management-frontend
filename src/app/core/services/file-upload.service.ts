import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  FileType,
  UploadedFile
} from '../models/uploaded-file.model';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private readonly apiUrl = 'http://localhost:8080/api/files/upload';

  constructor(private readonly http: HttpClient) {}

  upload(file: File,
         type: FileType): Observable<UploadedFile> {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('type', type);

    return this.http.post<UploadedFile>(this.apiUrl, formData);
  }
}