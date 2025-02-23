import { HttpClient } from '@angular/common/http';
import { Component ,inject,OnInit} from '@angular/core';
import { MyReservationServiceService } from '../../services/my-reservation-service.service';
import { IMyReservation } from '../../model/interface/myReservation';
import { error } from 'console';
import { Observer } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-reservation',
  imports: [],
  templateUrl: './my-reservation.component.html',
  styleUrl: './my-reservation.component.css'
})
export class MyReservationComponent implements OnInit{
  reservation: IMyReservation[] = [];
  constructor(private myReservationService: MyReservationServiceService) {}
  
  ngOnInit(): void {
    const observer: Observer<IMyReservation[]> = {
      next: (result: IMyReservation[]) => {
        console.log(result);
        this.reservation = result.map(item => ({
          ...item,
          condition: false
        }));
      },
      error: (err: any) => {
        alert('API error');
      },
      complete: () => {
        console.log('API call completed');
      }
    };

    this.myReservationService.getMyReservation().subscribe(observer);
  }

  trackByIndex(index: number, item: any): any {
    return index;
  }

  togglePassengerDetails(item: any) {
   return  item.condition = !item.condition;
  }
}
  
