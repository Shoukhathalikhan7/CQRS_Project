import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LearningService {

  private apiUrl = 'http://localhost:5195/api/learningpath';

  constructor(private http: HttpClient) {}


upsert(data: any) {
  return this.http.post(
    'http://localhost:5195/api/learningpath/upsert',
    data
  );
}
getAll() {
  return this.http.get('http://localhost:5195/api/learningpath');
}
}