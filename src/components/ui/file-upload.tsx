import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";

type FileUploadProps = {
  onChange: (file: File) => void;
  isLoading?: boolean;
};
export const FileUpload = ({
  onChange,
  isLoading = false,
}: FileUploadProps) => {
  const {
    getInputProps,
    getRootProps,
    acceptedFiles,
    isDragActive,
    fileRejections,
  } = useDropzone({
    maxFiles: 1,
    multiple: false,
    disabled: isLoading,
    maxSize: 2 * 1024 * 1024, // in bytes (2 MB)
    onDropAccepted(files) {
      if (files.length) onChange(files[0]);
    },
  });

  return (
    <div
      {...getRootProps({
        className: cn(
          "dropzone border rounded-xl p-4 border h-[80px] flex flex-col cursor-pointer"
        ),
        style: {
          border: isDragActive ? "2px solid black" : "",
        },
      })}
    >
      <p className="text-md">
        {isLoading
          ? "Uploading"
          : "Click here to upload files or Drag files here"}
      </p>
      {!!acceptedFiles.length && acceptedFiles[0].name}
      <input {...getInputProps()} />
      <div className="mt-auto">
        {fileRejections.map((file) => (
          <div key={file.file.name}>
            {file.errors.map((error) => (
              <span key={error.code} className="text-destructive">
                {error.code === "file-too-large"
                  ? "File too big! max allowed size is 2MB"
                  : error.message}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
