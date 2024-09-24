import { useEffect, useRef, useState } from 'react';
type UseControlPanelConfig = {
  hiddenWhenClickPanel?: boolean;
};

export const useControlPanel = (config?: UseControlPanelConfig) => {
  const { hiddenWhenClickPanel = true } = config || {};
  const panelRef = useRef<any>(null);
  const elementRef = useRef<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const handleOpen = () => {
    setIsVisible((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const isClickedElement =
      elementRef.current && elementRef.current.contains(event.target as Node);
    const isClickedPanel =
      (panelRef.current && panelRef.current.contains(event.target as Node)) ??
      false;

    const isClickedOutside = !isClickedElement && !isClickedPanel;

    if (isClickedElement) {
    } else if (isClickedOutside) {
      setIsVisible(false);
    } else {
      if (hiddenWhenClickPanel) {
        if (isClickedPanel) {
          setIsVisible(false);
        }
      }
    }
  };
  useEffect(() => {
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);
  return { isVisible, elementRef, panelRef, handleOpen };
};
