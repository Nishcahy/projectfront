import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBus } from '../model/interface/myReservation';

@Injectable({
  providedIn: 'root'
})
export class BusService {

  private apiUrl = 'http://localhost:8082/api/buses';

  constructor(private http: HttpClient) {}

  createBus(bus: Omit<IBus, 'busId' | 'bookedSeatNumbers'>): Observable<IBus> {
    return this.http.post<IBus>(this.apiUrl, bus);
  }

  getAllBuses(): Observable<IBus[]> {
    return this.http.get<IBus[]>(`${this.apiUrl}/all-bus`); // Updated endpoint
  }

  searchBuses(busNo: string): Observable<IBus[]> {
    return this.http.get<IBus[]>(`${this.apiUrl}/getByBusNo/${busNo}`); // Updated endpoint
  }

  updateBus(busId: number, bus: IBus): Observable<IBus> {
    return this.http.put<IBus>(`${this.apiUrl}/update-bus/${busId}`, bus); // Updated endpoint
  }

  deleteBus(busId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${busId}`);
  }

  getBusById(busId: number): Observable<IBus> {
    return this.http.get<IBus>(`${this.apiUrl}/findBus/${busId}`);
  }
}