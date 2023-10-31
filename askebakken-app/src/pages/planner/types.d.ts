export type Resident = Readonly<{
  id: string;
  firstName: string | null;
  lastName: string | null;
  child: boolean | null;
  houseNumber: string;
}>;

export type Recipe = Readonly<{
  id: string;
  name: string | null;
}>;

type AttendanceEvent = Readonly<{
  menuPlanId: string;
  residentId: string;
  attending: boolean;
}>;

export type Guests = Readonly<{
  houseNumber: string;
  numberOfAdultGuests: number;
  numberOfChildGuests: number;
}>;
