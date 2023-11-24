import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const ImageList = ({ 
    imageUrls, 
    handleActiveImageClick, 
    selectedActiveImage, 
    setSelectedActiveImage 
}) => {

  return (
    <div className="image-list absolute w-full h-[90%] right-0 top-[4.5rem] flex flex-col justify-between bg-[#0c1317] z-10">
        <div className='w-full flex flex-col items-center justify-center'>
          <div className='w-full flex items-start justify-start text-lg py-5 px-10'>
            <FontAwesomeIcon icon={faTimes} className='cursor-pointer' onClick={() => setSelectedActiveImage(null)} />
          </div>
          <div className='w-full flex items-center justify-between my-10'>
            <button 
                className='flex items-center justify-center bg-gray-200 text-gray-400 font-[700] text-[20px] rounded-[50%] w-[45px] h-[45px] ml-3'
                onClick={() => handleActiveImageClick(selectedActiveImage - 1)}
            >
                &lt;
            </button>
            <img src={imageUrls[selectedActiveImage]} alt="" className="max-h-[350px] max-w-[350px] object-contain" />
            <button 
                className='flex items-center justify-center bg-gray-200 text-gray-400 font-[700] text-[20px] rounded-[50%] w-[45px] h-[45px] mr-3'
                onClick={() => handleActiveImageClick(selectedActiveImage + 1)}
            >
                &gt;
            </button>
          </div>
        </div>
        <div className='border-y-[1px] py-2 overflow-x-scroll flex items-center justify-center space-x-4'>
            {imageUrls.map((imageUrl, index) => (
                <img
                    key={index}
                    src={imageUrl}
                    alt=''
                    className={`w-[70px] h-[70px] cursor-pointer ${selectedActiveImage === index ? 'border-green border-[3px]' : null}`}
                    onClick={() => handleActiveImageClick(index)}
                />
            ))}
        </div>
    </div>
  );
}

export default ImageList;
