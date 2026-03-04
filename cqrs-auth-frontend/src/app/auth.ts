import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  apiUrl = 'http://localhost:5195/api/auth';

  constructor(private http: HttpClient) {}

  signup(data: any) {
    return this.http.post(`${this.apiUrl}/signup`, data, {
      responseType: 'text'
    });
  }

  login(data: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, data);
  }

  getSecureData() {
    const token = localStorage.getItem('token');

    return this.http.get(`${this.apiUrl}/secure`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getUsers(): Observable<any[]> {
    const token = localStorage.getItem('token');

    return this.http.get<any[]>(`${this.apiUrl}/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
deleteUser(id: number) {
  const token = localStorage.getItem('token');

  return this.http.delete<any>(
    `http://localhost:5195/api/auth/delete/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}

promoteUser(id: number) {
  const token = localStorage.getItem('token');

  return this.http.put(
    `http://localhost:5195/api/auth/promote/${id}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
}
// ================= TASK APIs =================

addTask(data: any) {
  const token = localStorage.getItem('token');

  return this.http.post(
    `${this.apiUrl}/add-task`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}

getTasks(): Observable<any[]> {
  const token = localStorage.getItem('token');

  return this.http.get<any[]>(`${this.apiUrl}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}

getMyTasks(): Observable<any[]> {
  const token = localStorage.getItem('token');

  return this.http.get<any[]>(`${this.apiUrl}/my-tasks`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

updateTask(id: number, data: any) {
  const token = localStorage.getItem('token');

  return this.http.put(
    `${this.apiUrl}/update-task/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}

deleteTask(id: number) {
  const token = localStorage.getItem('token');

  return this.http.delete(
    `${this.apiUrl}/delete-task/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}
}