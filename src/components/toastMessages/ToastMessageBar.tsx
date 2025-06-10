"use client";

import { useToastMessage } from "@/contexts/ToastMessageContext";
import { useEffect } from "react";

export default function ToastMessageBar() {
  const { toastMessages, removeToastMessage } = useToastMessage();
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (toastMessages.length > 0) {
        removeToastMessage(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [toastMessages, removeToastMessage]);

  if (toastMessages.length === 0) return null;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50">
      {toastMessages.reverse().map((toast, index) => {
        const bgColor = toast.type === 'success' ? 'bg-green-500/90' : 
                       toast.type === 'error' ? 'bg-red-500/90' : 
                       'bg-blue-500/90';
        
        const icon = toast.type === 'success' ? '✓' :
                    toast.type === 'error' ? '!' :
                    'i';
                       
        return (
          <div
            key={index}
            className={`${bgColor} text-white px-6 py-4 rounded-xl shadow-xl flex justify-between items-center min-w-[640px] backdrop-blur-sm`}
            style={{
              position: 'relative',
              transform: `translateY(${-index * 72}px)`,
              zIndex: toastMessages.length - index
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold">{icon}</span>
              <p className="font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToastMessage(index)}
              className="ml-4 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10 w-6 h-6 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
