import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  // DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAddVolume } from "@/lib/query_and_mutations/volume_issue/addVolume";
import { allVolumeQueryOptions } from "@/lib/query_and_mutations/volume_issue/getAllVolumes";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderClosed, PlusIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/published-manuscripts/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading, error } = useQuery(allVolumeQueryOptions());

  const volumes = data?.data || [];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="flex gap-1">
          <h3>Published Mauscripts</h3>
        </div>
        <AddVolume />
      </div>
      {isLoading && <p>Data is Loading</p>}
      {error && <p>{error.message}</p>}

      <div className="grid grid-cols-4 gap-4">
        {volumes.map((volume) => {
          return (
            <Link
              to="/published-manuscripts/$volume"
              params={{
                volume: volume.id,
              }}
              className="p-5 border h-40 flex flex-col items-center justify-center rounded-2xl hover:bg-accent"
            >
              <FolderClosed className="h-12 w-12" />
              <div className="flex flex-col gap-3 justify-center items-center">
                <span>{volume.title}</span>
                <div className="flex gap-4">
                  {/* <span className="flex gap-1 justify-center items-center">
                    <Book />1
                  </span>
                  <span className="flex gap-1 justify-center items-center">
                    <FileText /> 3
                  </span> */}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const AddVolume = () => {
  const { mutate } = useAddVolume();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const addVolume = () => {
    mutate({
      description,
      title,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer flex bg-primary rounded-lg py-2 px-4 text-primary-foreground text-sm items-center gap-2">
          <PlusIcon /> Add Volume
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Volume</DialogTitle>
          {/* <DialogDescription>
            Select the issue you want to publish the manuscript to. You can
            check them at Issue Management
          </DialogDescription> */}
        </DialogHeader>
        <Label htmlFor="volume_title">Volume Title</Label>
        <Input
          placeholder="Enter volume"
          id="volume_title"
          value={title}
          onChange={(e) => {
            setTitle(e.currentTarget.value);
          }}
        />
        <Label htmlFor="volume_description">Volume Title</Label>
        <Textarea
          placeholder="Enter description"
          id="volume_description"
          value={description}
          onChange={(e) => {
            setDescription(e.currentTarget.value);
          }}
        />

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="border">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              disabled={!(title && description)}
              onClick={addVolume}
            >
              Add Volume
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
