import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
  children: ReactNode;
}

const Portal: React.FC<PortalProps> = ({ children }) => {
  return ReactDOM.createPortal(
    children,
    document.body, // Hoặc một phần tử khác ngoài vùng cuộn
  );
};

export default Portal;
