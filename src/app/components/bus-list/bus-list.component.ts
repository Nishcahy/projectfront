import { Component, OnInit } from '@angular/core';
import { IBus } from '../../model/interface/myReservation';
import { BusService } from '../../services/bus.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bus-list',
  imports: [FormsModule,CommonModule,CurrencyPipe,UpperCasePipe],
  templateUrl: './bus-list.component.html',
  styleUrl: './bus-list.component.css'
})
export class BusListComponent implements OnInit {

  buses: IBus[] = [];
  searchTerm = '';

  constructor(private busService: BusService,private router:Router) {}

  ngOnInit() {
    this.loadAllBuses();
  }

  loadAllBuses() {
    this.busService.getAllBuses().subscribe(
      (buses) => {
        this.buses = buses;
      },
      (error) => {
        console.error('Error loading buses:', error);
      }
    );
  }

  searchBuses() {
    if (this.searchTerm) {
      this.busService.searchBuses(this.searchTerm).subscribe(
        (buses) => {
          this.buses = buses;
        },
        (error) => {
          console.error('Error searching buses:', error);
        }
      );
    } else {
      this.loadAllBuses();
    }
  }

  editBus(busId: number) {
    this.router.navigate(['/edit-bus', busId]);
  }

  deleteBus(busId: number) {
    this.busService.deleteBus(busId).subscribe(
      () => {
        console.log('Bus deleted:', busId);
        if (this.searchTerm) {
          this.searchBuses();
        } else {
          this.loadAllBuses();
        }

      },
      (error) => {
        console.error('Error deleting bus:', error);
      }
    );
  }
}
