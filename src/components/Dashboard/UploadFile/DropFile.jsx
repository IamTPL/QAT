import React from "react";
import { useDropzone } from "react-dropzone";

const DropFile = ({ onDrop }) => {
  const { getRootProps, getInputProps, acceptedFiles, fileRejections } =
    useDropzone({
      onDrop,
      multiple: true,
      accept: {
        "application/pdf": [".pdf"],
      },
      maxSize: 50000000,
      maxFiles: 20,
      onError: (e) => console.log(e),
    });
  return (
    <>
      <p>Select modal and upload your files</p>
      <p>Click or drop file list</p>
      <div className="text-gray-500">
        <ul className="list-disc pl-5">
          <li>#Max 20 files / upload.</li>
          <li>#Max 50MB / file.</li>
          <li>#Only PDF files are allowed.</li>
        </ul>
      </div>

      <div
        {...getRootProps()}
        className="border-dashed border-2 border-orange-400 rounded-md p-6 cursor-pointer text-center"
      >
        <input {...getInputProps()} />
        <p>Select a model and upload your files</p>
        <p className="text-gray-500">Click or drop file list</p>
        <div className="mt-4">
          <button className="px-4 py-2 primary-button rounded-lg">
            Upload here
          </button>
        </div>
        {fileRejections.length > 0 && (
          <div className="mt-4 text-red-500">
            {fileRejections.length > 20 && <p>Invalid numbers.</p>}
          </div>
        )}
      </div>
    </>
  );
};

export default DropFile;
