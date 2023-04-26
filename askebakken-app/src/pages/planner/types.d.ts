export type Resident = Readonly<{
  id: string;
  firstName: string | null;
  lastName: string | null;
}>;

export type Recipe = Readonly<{
  id: string;
  name: string | null;
}>;
