// Image.js
import { chakra } from "@chakra-ui/react";
import Image from "next/image";
import React, { useState } from 'react';

const EnhancedChakraNextImage = (props: any) => {
  const [imageSrc, setImageSrc] = useState(props.src);

  const handleImageError = () => {
    setImageSrc('/beaver-eventcard.jpeg');
  };

  return (
    <chakra.img
      {...props}
      src={imageSrc}
      onError={handleImageError}
      style={{
        objectFit: 'cover',
        width: '100%',
        height: '100%',
        borderRadius: 'inherit',
      }}
    />
  );
};

export default EnhancedChakraNextImage;