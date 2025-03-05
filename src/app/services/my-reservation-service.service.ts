import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMyReservation, IReservation } from '../model/interface/myReservation';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MyReservationServiceService {

  private apiUrl = 'http://localhost:8082/api/reservations';

  constructor(private http: HttpClient) {}
  
  getMyReservation(userId: number): Observable<IMyReservation[]> {
    const url = `${this.apiUrl}/user/${userId}`;
    return this.http.get<IMyReservation[]>(url);
  }
  getAllReservations(): Observable<IMyReservation[]> {
    return this.http.get<IMyReservation[]>(`${this.apiUrl}/getAllReservation`);
}
  deleteReservation(reservationId: number): Observable<any> {
    const url = `${this.apiUrl}/${reservationId}`;
    return this.http.delete(url, { responseType: 'text' });
  }
  
  addReservation(reservation: Omit<IReservation, 'totalAmount'>): Observable<any> {
    return this.http.post(this.apiUrl, reservation);
  }

  getReservationByBusId(busId:string):Observable<IMyReservation[]>{
    const url=`${this.apiUrl}/by-bus-id/${busId}`
    return this.http.get<IMyReservation[]>(url);
  }
}