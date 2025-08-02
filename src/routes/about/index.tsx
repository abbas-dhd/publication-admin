import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      Hello from About!
      <Button className="cursor-pointer animate-in fade-in duration-1000 ">
        Hi
      </Button>
    </div>
  );
}
