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
    bookedSeatNumbers: number[] | null;
  }
  
  export interface IReservation {
    id?: number;
    userId: number;
    busId: number;
    date: string;
    numberOfSeats: number;
    totalAmount: number;
    passengers: IPassenger[];
  }
  
  export interface IPassenger {
    pid?: number;
    name: string;
    gender: string;
    age: number;
    seatNumber: number;
  }

  export interface Feedback {
    feedBackId: number;
    userId: number;
    reservationId: number;
    complaintStatement: string;
    date: string;
    busId: number;
  }

  export interface User{
    name:string,
    email:string,
    password:string,
    roles:string

  }
  