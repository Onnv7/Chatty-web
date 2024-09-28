import { useRef, useEffect, useState } from 'react';
import './popup.css';
type PopupComponentProps = {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
  closeWhenClickOutSite?: boolean;
  primaryButton?: {
    text?: string;
    onClick?: () => Promise<void> | void;
  };
  secondaryButton?: {
    text?: string;
    onClick?: () => Promise<void> | void;
  };
};

function PopupComponent({
  primaryButton,
  secondaryButton,
  title,
  content,
  isOpen,
  closeWhenClickOutSite = false,
  onClose,
}: PopupComponentProps) {
  const primaryBtn = { text: 'Yes', ...primaryButton };
  const secondaryBtn = { text: 'No', ...secondaryButton };
  const popupRef = useRef<any>(null);
  const handleClickOutside = (event: MouseEvent) => {
    const isClickedPopup =
      (popupRef.current && popupRef.current.contains(event.target as Node)) ??
      false;

    if (closeWhenClickOutSite && !isClickedPopup && onClose) {
      onClose();
    }
  };
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
          <div
            className="animate-pop-in z-10 transform select-none rounded-lg bg-white p-6 shadow-lg transition-transform duration-300"
            ref={popupRef}
          >
            <button
              className="absolute right-2 top-2 text-gray-700 hover:text-gray-900"
              onClick={onClose}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold">{title}</h2>
            <p>{content}</p>
            <span className="mt-4 flex gap-2">
              <button
                className="grow rounded-[1rem] border-[1px] border-black px-2 py-1"
                onClick={() => {
                  if (secondaryBtn.onClick) {
                    secondaryBtn.onClick();
                  }
                }}
              >
                {secondaryBtn.text}
              </button>
              <button
                className="grow rounded-[1rem] border-[1px] border-black bg-black px-2 py-1 text-white"
                onClick={() => {
                  if (primaryBtn.onClick) {
                    primaryBtn.onClick();
                  }
                }}
              >
                {primaryBtn.text}
              </button>
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default PopupComponent;
