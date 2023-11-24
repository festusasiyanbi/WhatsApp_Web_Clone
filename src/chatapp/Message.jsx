import React, { useContext } from 'react'
import { PiCaretDownBold } from 'react-icons/pi'
import ImageGrid from './ImageGrid'
import { AuthContext } from '../context/AuthContext';

const Message = ({
    index,
    message,
    hoveredMessage,
    handleCopyMessage,
    handleDeleteMessage,
    deleteModal,
    setDeleteModal,
    messageOptions,
    handleSelectedMessageToDelete,
    handleOpenMessageOptions,
}) => {
    const { currentUser } = useContext(AuthContext);

  return (
    <div>
        <div className=''>
            <span className="w-fit h-fit">
                {hoveredMessage === index && message.text !== "🚫 This message has been deleted" && (
                    <span
                    className="absolute top-[-2px] right-1 text-black backdrop-blur-xs text-sm"
                    onClick={() => handleOpenMessageOptions(index)}
                    >
                        <PiCaretDownBold />
                    </span>
                )}
                <p className="h-full" title={message.text}>{message.text}</p>
                {message.images && message.images.length >= 4 ? (
                    <ImageGrid imageUrls={message.images} />
                ) : (
                    message.images && message.images.map((imageUrl, index) => (
                        <img key={index} src={imageUrl} alt='' title='photo' className='h-[250px] w-[200px]'/>
                    ))
                )}
                <span className="timestamp">
                    {message.timeStamp?.toDate().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
            </span>
            {messageOptions === index && (
            <div className="absolute top-8 right-5 flex flex-col bg-light text-white w-[100px] items-center justify-center z-10 space-y-4 py-2">
                <span onClick={() => handleCopyMessage(message.text)} className="cursor-pointer hover-bg-darkblue w-full text-center py-1">Copy</span>
                {message.senderEmail === currentUser.email &&
                    <span 
                        onClick={() => handleSelectedMessageToDelete(index)} 
                        className="cursor-pointer hover-bg-darkblue w-full text-center py-1"
                    >
                        Delete
                    </span>
                }
            </div>
            )}
        </div>
        {deleteModal === index && 
            <div className="delete-modal absolute w-[100vw] h-[100vh] bg-light left-0 top-0 flex items-center justify-center z-10 opacity-100">
                <div className="bg-light w-[400px] h-[200px] flex flex-col justify-between px-5 py-3">
                    <span>Delete message?</span>
                    <div className="w-[100%] flex items-end justify-end flex-col space-y-6">
                        <button onClick={() => handleDeleteMessage(index)}>
                            Delete
                        </button>
                        <button onClick={() => setDeleteModal(null)}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        }
    </div>
  )
}

export default Message