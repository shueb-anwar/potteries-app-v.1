export interface IBus {
    name: string;
    registration: string;
    contact: string;
    fare: string;
    capacity: string;
    routeDetail: IRoute[]
}

interface IRoute {
  from: string;
  to: string;
  id: string
  stopDetail: IStop[]
}

interface IStop {
  locatoin: string;
  time: string;
}