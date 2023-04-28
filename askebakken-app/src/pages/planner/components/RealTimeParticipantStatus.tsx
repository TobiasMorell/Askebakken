import { useRecoilValueLoadable, useSetRecoilState } from "recoil";
import {
  menuPlanAttendanceEvents,
  menuPlanAttendanceEventsState,
} from "../state";
import { useEffect } from "react";

export function RealTimeParticipantStatus() {
  const participantEvents = useRecoilValueLoadable(menuPlanAttendanceEvents);
  const setCachedEvents = useSetRecoilState(menuPlanAttendanceEventsState);

  useEffect(() => {
    if (participantEvents.state === "hasValue") {
      const event = participantEvents.contents;
      setCachedEvents((prev) => {
        const existing = prev.find(
          (e) =>
            e.menuPlanId === event.menuPlanId &&
            e.residentId === event.residentId
        );
        if (existing) {
          return prev.map((e) => {
            if (
              e.menuPlanId === event.menuPlanId &&
              e.residentId === event.residentId
            ) {
              return event;
            }
            return e;
          });
        }
        return [...prev, event];
      });
    }
  }, [participantEvents, setCachedEvents]);

  return <></>;
}
