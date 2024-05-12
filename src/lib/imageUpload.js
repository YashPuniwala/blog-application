import { CldUploadButton, CldUploadWidgetResults } from "next-cloudinary";
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
      <CldUploadButton uploadPreset={uploadPreset} onUpload={handleImageUpload} style={{width:"100%"}}>
        Image Upload
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