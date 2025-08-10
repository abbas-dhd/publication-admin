// import CustomTable from "@/components/CustomTable";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      {/* <CustomTable /> */}
    </div>
  );
}
