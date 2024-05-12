import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import React from "react";

const ImageUpload = ({
  uploadPreset,
  onImageUpload,
  imageUrl,
  onRemoveImage,
}) => {
  const handleImageUpload = (result) => {
    onImageUpload(result);
  };

  // const handleImageUpload = (result: CldUploadWidgetResults) => {
  //   const { info } = result;
  
  //   if (typeof info === "object" && "resource_type" in info) {
  //     const fileType = info.resource_type as string;
  
  //     if (fileType === "image") {
  //       onImageUpload(result);
  //     } else {
  //       alert("Only image files are allowed. Please upload an image file.");
  //     }
  //   } else {
  //     console.error("Invalid file information");
  //   }
  // };

  const handleRemove = (url) => {
    onRemoveImage(url);
  };


  return (
    <div>
      <CldUploadButton uploadPreset={uploadPreset} onUpload={handleImageUpload}>
      <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </div>
      </CldUploadButton>
      <div>
        {imageUrl.map((image, index) => (
          <div key={index}>
            <Image src={image.imageUrl} width={300} height={200} alt="Uploaded Image" />
            <div>
              <button
                onClick={() => handleRemove(image.imageUrl)}
                className="py-2 px-4 rounded-md font-bold w-fit bg-red-600 text-white mb-4"
              >
                Remove Image
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;