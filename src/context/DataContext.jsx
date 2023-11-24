import React, { createContext, useEffect, useRef, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [sidebarToggler, setSidebarToggler] = useState(false);
  const [chatappToggler, setChatappToggler] = useState(false);
  const [fileToggler, setFileToggler] = useState(false);
  const [chatSidebarToggler, setChatSidebarToggler] = useState(false);

  const toggleRef = useRef(null); // Add a ref for the toggle element

  // Add an event listener to close the toggle when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toggleRef.current && !toggleRef.current.contains(event.target)) {
        // Click occurred outside the toggle, so close it
        setSidebarToggler(false);
        setChatappToggler(false);
        setFileToggler(false);
        setChatSidebarToggler(false);
      }
    };

    // Attach the event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleRef]);

  return (
    <DataContext.Provider
      value={{
        fileToggler,
        setFileToggler,
        sidebarToggler,
        setSidebarToggler,
        chatappToggler,
        setChatappToggler,
        chatSidebarToggler,
        setChatSidebarToggler,
      }}
    >
      <div ref={toggleRef}>{children}</div>
    </DataContext.Provider>
  );
};

export default DataContext;
