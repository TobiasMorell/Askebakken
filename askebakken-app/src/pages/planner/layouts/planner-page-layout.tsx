import { RecoilValueReadOnly } from "recoil";
import { selectedDaysWithParticipantsState } from "../menu-planner-state";
import { Resident } from "../types";

export type PlannerPageLayoutProviderProps = {
  menuPlans: typeof selectedDaysWithParticipantsState extends RecoilValueReadOnly<
    infer T
  >
    ? T
    : never;
  houses: string[];
  residentsByHouse?: Map<string, Resident[]>;
  residentById?: Map<string, Resident>;
};

export const participantCategories = ["Voksen", "Voksen gæst", "Barn gæst"] as const;
