import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface NewsModalProps {
  children: ReactNode;
  onClose: () => void;
}

export default function NewsModal({ children, onClose }: NewsModalProps) {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold"
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    modalRoot
  );
}
