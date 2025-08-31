import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  // DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type Volume } from "@/lib/api/volume_and_issue";
import { useAddVolume } from "@/lib/query_and_mutations/volume_issue/addVolume";
import { useDeleteVolume } from "@/lib/query_and_mutations/volume_issue/deleteVolume";
import { allVolumeQueryOptions } from "@/lib/query_and_mutations/volume_issue/getAllVolumes";
import { useUpdateVolume } from "@/lib/query_and_mutations/volume_issue/updateVolume";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { EllipsisVertical, FolderClosed, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/published-manuscripts/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading, error } = useQuery(allVolumeQueryOptions());
  const [viewDetailsModal, setViewDetailsModal] = useState<boolean>(false);
  const [editVolumeModal, setEditVolumeModal] = useState<boolean>(false);
  const [deleteVolumeModal, setDeleteVolumeModal] = useState<boolean>(false);
  const [volume, setVolume] = useState<Volume | null>(null);

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
            <div className="relative" key={volume.id}>
              <Link
                to="/published-manuscripts/$volume"
                params={{
                  volume: volume.id,
                }}
                className=" p-5 border h-40 flex flex-col items-center justify-center rounded-2xl hover:bg-accent"
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
              <div className="absolute top-3 right-3">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisVertical className="h-8 w-8 p-2 cursor-pointer hover:text-primary" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setVolume(volume);
                        setViewDetailsModal(true);
                      }}
                    >
                      More Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setVolume(volume);
                        setEditVolumeModal(true);
                      }}
                    >
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => {
                        setVolume(volume);
                        setDeleteVolumeModal(true);
                      }}
                    >
                      Delete Volume
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>
      {viewDetailsModal && volume && (
        <VolumeDetails
          volume={volume}
          open={viewDetailsModal}
          setOpen={setViewDetailsModal}
          onModalClose={() => {
            setVolume(null);
            setViewDetailsModal(false);
            // Temp fix for issue https://github.com/radix-ui/primitives/issues/2122
            setTimeout(() => {
              document.body.style = "";
            });
          }}
        />
      )}
      {editVolumeModal && volume && (
        <EditVolume
          volume={volume}
          open={editVolumeModal}
          setOpen={setEditVolumeModal}
          onModalClose={() => {
            setVolume(null);
            setEditVolumeModal(false);
            // Temp fix for issue https://github.com/radix-ui/primitives/issues/2122
            setTimeout(() => {
              document.body.style = "";
            });
          }}
        />
      )}
      {deleteVolumeModal && volume && (
        <DeleteVolume
          volume={volume}
          open={deleteVolumeModal}
          setOpen={setDeleteVolumeModal}
          onModalClose={() => {
            setVolume(null);
            setDeleteVolumeModal(false);
            // Temp fix for issue https://github.com/radix-ui/primitives/issues/2122
            setTimeout(() => {
              document.body.style = "";
            });
          }}
        />
      )}
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

type VolumeDetailsProps = {
  volume: Volume;
  open: boolean;
  setOpen: (open: boolean) => void;
  onModalClose?: () => void;
};

const VolumeDetails = ({
  volume,
  open,
  setOpen,
  onModalClose,
}: VolumeDetailsProps) => {
  return (
    <Dialog
      key={volume.id}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value && onModalClose) onModalClose();
      }}
      open={open}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{volume.title}</DialogTitle>
          <DialogDescription>{volume.description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="border">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type EditVolumeProps = {
  volume: Volume;
  open: boolean;
  setOpen: (open: boolean) => void;
  onModalClose?: () => void;
};

const EditVolume = ({
  open,
  setOpen,
  volume,
  onModalClose,
}: EditVolumeProps) => {
  const [title, setTitle] = useState<string>(volume.title);
  const [description, setDescription] = useState<string>(volume.description);
  const { mutate } = useUpdateVolume({
    onSuccess: (data) => {
      const msg = data.message;
      toast.success(msg);
    },
    onError: (error) => {
      const msg = error.message;
      toast.error(msg);
    },
  });

  const updateVolume = () => {
    mutate({
      description,
      title,
      volume_id: volume.id,
    });
  };

  return (
    <Dialog
      key={volume.id}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value && onModalClose) onModalClose();
      }}
      open={open}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Volume</DialogTitle>
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
              onClick={updateVolume}
            >
              Update
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type DeleteVolumeProps = {
  volume: Volume;
  open: boolean;
  setOpen: (open: boolean) => void;
  onModalClose?: () => void;
};

const DeleteVolume = ({
  volume,
  open,
  setOpen,
  onModalClose,
}: DeleteVolumeProps) => {
  const { mutate } = useDeleteVolume({
    onSuccess: (data) => {
      const msg = data.message;
      toast.success(msg);
    },
    onError: (error) => {
      const msg = error.message;
      toast.error(msg);
    },
  });

  const deleteVolume = () => {
    mutate({
      volume_id: volume.id,
    });
  };
  return (
    <Dialog
      key={volume.id}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value && onModalClose) onModalClose();
      }}
      open={open}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {volume.title}?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the Volume named ‘{volume.title}’?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="border">
              Close
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              type="button"
              variant="destructive"
              className="border"
              onClick={deleteVolume}
            >
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
