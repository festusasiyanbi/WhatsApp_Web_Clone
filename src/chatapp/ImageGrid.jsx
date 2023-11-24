import React, { useState } from 'react';
import ImageList from './ImageList';

function ImageGrid({ imageUrls }) {
    const [selectedActiveImage, setSelectedActiveImage] = useState(null);

    const handleActiveImageClick = (index) => {
        setSelectedActiveImage(index)
    }

  return (
    <>
        {!selectedActiveImage &&
            <div className="image-grid relative grid grid-cols-2 grid-rows-2">
                {imageUrls.slice(0, 4).map((imageUrl, index) => (
                    <div 
                        key={index}
                        className="image-item m-[2px]"
                        onClick={() => handleActiveImageClick(index)}
                    >
                        <img 
                            src={imageUrl} 
                            alt=''
                            className='w-[150px] h-[150px] cursor-pointer rounded-[10px]'
                        />
                    </div>
                ))}
                {imageUrls.length >= 5 && (
                    <div 
                        className="image-item absolute right-0 bottom-0 bg-light opacity-[0.7] h-[152px] w-[152px] cursor-pointer rounded-[10px]"
                        onClick={() => handleActiveImageClick(0)}
                    >
                        <p className='text-2xl text-white font-bold w-full h-full transform translate-x-1/2 translate-y-1/2'>+{imageUrls.length - 4}</p>
                    </div>
                )}
            </div>
        }
        {selectedActiveImage !== null && 
            <ImageList 
                imageUrls={imageUrls}
                selectedActiveImage={selectedActiveImage}
                setSelectedActiveImage={setSelectedActiveImage}
                handleActiveImageClick={handleActiveImageClick}
            />
        }
    </>
  );
}

export default ImageGrid;
