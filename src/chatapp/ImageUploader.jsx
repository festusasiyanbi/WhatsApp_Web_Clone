import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { AiOutlineSend } from 'react-icons/ai';

const ImageUploader = ({ images, setImages, handleSend }) => {
  const [hovered, setHovered] = useState(null);
  const [activeImage, setActiveImage] = useState(images[0]);

  const handleSelectImage = (index) => {
    setActiveImage(images[index]);
  };

  const deleteImages = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  return (
    <div className='absolute w-full h-[90%] top-[4.5rem] flex flex-col justify-between bg-[#0c1317] z-50'>
      <div className="w-full flex">
        <div className='w-full flex flex-col items-center justify-center'>
          <div className='w-full flex items-start justify-start text-lg py-5 px-10'>
            <FontAwesomeIcon icon={faTimes} className='cursor-pointer' onClick={() => setImages([])} />
          </div>
          <div className='flex items-center justify-center my-10 bg-white'>
            <img src={URL.createObjectURL(activeImage)} alt="Preview" className="max-h-[350px] max-w-[350px] object-contain" />
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-center h-[100px]">
        <div className="w-[90%] flex items-center justify-center space-x-10">
          {images.length > 0 &&
            images.map((image, index) => (
              <div key={index}>
                <div className={`relative flex items-center rounded-[5px] cursor-pointer bg-white ${activeImage === image ? 'border-green border-[3px]' : null}`}>
                  <div
                    className='h-[50px] w-[50px]'
                    onMouseEnter={() => setHovered(index)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => handleSelectImage(index)}
                  >
                    <img src={URL.createObjectURL(image)} alt='' className='w-full h-full object-contain' />
                    {hovered === index &&
                      <span
                        className="absolute right-0 top-0 flex items-start justify-end pr-1"
                        onClick={() => deleteImages(index)}
                      >x</span>
                    }
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className='w-[10%] text-white'>
          <button
            className="cursor-pointer bg-green text-white p-3 rounded-[36px] rotate-btn"
            onClick={handleSend}
          >
            <AiOutlineSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
