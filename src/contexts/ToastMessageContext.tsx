"use client";

import { createContext, useContext, useState } from "react";

interface ToastMessage {
  message: string;
  type: "success" | "error" | "info";
}

interface ToastMessageContextType {
  toastMessages: ToastMessage[];
  addToastMessage: (message: string, type: "success" | "error" | "info") => void;
  removeToastMessage: (index: number) => void;
  clearToastMessages: () => void;
}


const ToastMessageContext = createContext<ToastMessageContextType>({
  toastMessages: [],
  addToastMessage: () => {},
  removeToastMessage: () => {},
  clearToastMessages: () => {},
});

export const useToastMessage = () => {
  return useContext(ToastMessageContext);
};

export const ToastMessageProvider = ({ children }: { children: React.ReactNode }) => {
  const [toastMessages, setToastMessages] = useState<ToastMessage[]>([]);

  const addToastMessage = (message: string, type: "success" | "error" | "info") => {
    setToastMessages([...toastMessages, { message, type }]);
  };

  const removeToastMessage = (index: number) => {
    setToastMessages(toastMessages.filter((_, i) => i !== index));
  };

  const clearToastMessages = () => {
    setToastMessages([]);
  };
  return (
    <ToastMessageContext.Provider value={{ toastMessages, addToastMessage, removeToastMessage, clearToastMessages }}>
      {children}
    </ToastMessageContext.Provider>
  );
};