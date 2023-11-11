import { useMemo } from "react";
import { PlannerPageLayoutProviderProps } from "../layouts/planner-page-layout";
import { menuPlanCategories } from "../../../menu-plan-categories";

export function MenuPlanName(props: {
  menuPlan: PlannerPageLayoutProviderProps["menuPlans"][0];
}): React.ReactNode {
  const { recipes } = props.menuPlan;
  const recipeByCategory = useMemo(
    () => recipes.toDictionary((r) => r.category),
    [[recipes]]
  );

  return (
    <>
      {menuPlanCategories
        .map((c) => recipeByCategory.get(c)?.name)
        .filter((n) => !!n)
        .join(" | ")}
    </>
  );
}
