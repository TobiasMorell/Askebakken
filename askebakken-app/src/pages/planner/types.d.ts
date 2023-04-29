export type Resident = Readonly<{
  id: string;
  firstName: string | null;
  lastName: string | null;
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
