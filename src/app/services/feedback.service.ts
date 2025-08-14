import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feedback } from '../model/interface/myReservation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  
  private apiUrl = 'http://localhost:8082/feedback'; // Base URL

  constructor(private http: HttpClient) {}

  getFeedbackByUserId(userId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/getByUserId/${userId}`);
  }

  deleteFeedback(feedbackId: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete/${feedbackId}`, { responseType: 'text' });
  }

  updateFeedback(feedbackId: number, feedback: any): Observable<any> { 
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); 
    return this.http.put(`${this.apiUrl}/update/${feedbackId}`, feedback, { headers });
  }

  saveFeedback(feedback: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/save`, feedback, { headers });
  }

  getAllFeedback():Observable<Feedback[]>{
      const url=this.apiUrl+`/get-all-feedback`;
      return this.http.get<Feedback[]>(url);
         
  }
}
