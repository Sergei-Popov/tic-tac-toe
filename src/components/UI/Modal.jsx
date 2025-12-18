import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, children }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="
        fixed inset-0 z-50
        flex items-end sm:items-center justify-center
        bg-black/40 backdrop-blur-sm
        animate-fadeIn
      "
    >
      <div
        className="
          w-full sm:max-w-md
          max-h-[90vh] overflow-y-auto
          bg-[var(--bg-primary)]
          rounded-t-[24px] sm:rounded-softer
          shadow-2xl
          animate-slideUp
        "
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
