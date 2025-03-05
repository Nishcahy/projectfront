import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../model/interface/myReservation';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8082/auth';

  constructor(private http: HttpClient) {}

  register(user:User): Observable<string>{
    const api=this.baseUrl+`/new`;
    // debugger;
    return this.http.post(api,user,{ responseType: 'text' });

  }

  
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/authenticate`, credentials).pipe(
      map((response: any) => {
        if (response && response.token && response.userId) {
          this.setToken(response.token);
          this.setUserId(response.userId);
          return response;
        } else {
          throw new Error('Token or userId not found in response');
        }
      })
    );
  }

  
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      return parseInt(userId, 10);
    }
    return null;
  }

  setUserId(userId: number): void {
    localStorage.setItem('user_id', userId.toString());
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.roles;
      } catch (e) {
        console.error('Error decoding token', e);
        return null;
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}