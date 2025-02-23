export interface IMyReservation {
    bus: IBus;
    reservation: IReservation;
  }
  
  export interface IBus {
    busId: number;
    busNo: string;
    routeFrom: string;
    routeTo: string;
    departureTime: string;
    price: number;
    seats: number;
    availableSeats: number;
    bookedSeatNumbers: number[];
  }
  
  export interface IReservation {
    id: number;
    userId: number;
    busId: number;
    date: string;
    numberOfSeats: number;
    totalAmount: number;
    passengers: IPassenger[];
  }
  
  export interface IPassenger {
    pid: number;
    name: string;
    gender: string;
    age: number;
    seatNumber: number;
  }
  