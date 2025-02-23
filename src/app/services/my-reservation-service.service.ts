import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMyReservation } from '../model/interface/myReservation';

@Injectable({
  providedIn: 'root'
})
export class MyReservationServiceService {

  private apiUrl = 'http://localhost:8081/api/reservations/user/1';

  constructor(private http: HttpClient) {}

  getMyReservation(): Observable<IMyReservation[]> {
    return this.http.get<IMyReservation[]>(this.apiUrl);
  }
}