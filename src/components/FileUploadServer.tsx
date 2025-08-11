import { SERVER_API } from "@/lib/contants";
import { useState } from "react";
import { FileUpload } from "./ui/file-upload";
import { Trash2 } from "lucide-react";

import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

type ResponseFile = {
  url: string;
  name: string;
};

type FileUploadResponse = {
  message: string;
  error?: string;
  data: {
    file: ResponseFile;
  };
};

const uploadFileToServer = async (file: File): Promise<FileUploadResponse> => {
  const fd = new FormData();

  fd.append("file", file);

  const resposne = await fetch(`${SERVER_API}/api/core/upload-file/`, {
    method: "POST",
    body: fd,
  });

  const data = (await resposne.json()) as FileUploadResponse;
  console.log(data);
  return data;
};

type FileUploadServerProp = {
  value: ResponseFile | null;
  onUploadSuccess: (file: ResponseFile) => void;
  onUploadFail: () => void;
  onRemoveFile: () => void;
};

export const FileUploadServerOLD = ({
  value = null,
  onUploadSuccess,
  onUploadFail,
  onRemoveFile,
}: FileUploadServerProp) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [fileData, setFileData] = useState<ResponseFile | null>(value);

  return (
    <>
      {!value && (
        <FileUpload
          isLoading={isLoading}
          onChange={async (file) => {
            setIsLoading(true);

            const url = await uploadFileToServer(file)
              .catch((error) => {
                console.log(error);
                onUploadFail?.();
              })
              .finally(() => {
                setIsLoading(false);
              });

            if (url) {
              const file_data = (url as FileUploadResponse).data.file;
              // setFileData(file_data);
              onUploadSuccess(file_data);
            }
          }}
        />
      )}
      {value != null && (
        <div className="h-[4rem] w-full border rounded-[8px] p-4 flex align-center justify-between">
          <a href={value.url} target="_blank">
            <strong>{value.name}</strong>
          </a>
          <button
            className="pointer text-destructive"
            onClick={(e) => {
              e.preventDefault();
              onRemoveFile();
            }}
            type="button"
          >
            <Trash2 />
          </button>
        </div>
      )}
    </>
  );
};

type FileUploadServer2Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
};

export const FileUploadServer = <T extends FieldValues>({
  name,
  control,
}: FileUploadServer2Props<T>) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    field: { value, onChange },
  } = useController({ name, control });

  return (
    <div>
      {!value && (
        <FileUpload
          isLoading={isLoading}
          onChange={async (file) => {
            setIsLoading(true);

            try {
              const res = await uploadFileToServer(file);
              onChange(res.data.file); // directly update RHF value
            } catch (err) {
              console.error(err);
              onChange(null); // clear value if failed
            } finally {
              setIsLoading(false);
            }
          }}
        />
      )}

      {value && (
        <div className="h-[4rem] w-full border rounded-[8px] p-4 flex align-center justify-between">
          <a href={value.url} target="_blank" rel="noopener noreferrer">
            <strong>{value.name}</strong>
          </a>
          <button
            className="pointer text-destructive"
            onClick={(e) => {
              e.preventDefault();
              onChange(null);
            }}
            type="button"
          >
            <Trash2 />
          </button>
        </div>
      )}
    </div>
  );
};
