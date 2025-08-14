import { isMatch, useMatches } from "@tanstack/react-router";

export const useCrumbs = () => {
  const matches = useMatches();

  console.log(matches);

  if (matches.some((match) => match.status === "pending")) return null;

  const matchesWithCrumbs = matches.filter((match) =>
    isMatch(match, "loaderData.crumb")
  );

  return matchesWithCrumbs;
};
