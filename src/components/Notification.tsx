import React, { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";

let toastTopCenterRef: React.RefObject<Toast>;

type MessageType =
  | "error"
  | "success"
  | "info"
  | "warn"
  | "secondary"
  | "contrast";

export const showNotification = (message: any, type: MessageType) => {
  toastTopCenterRef.current?.show({
    severity: type,
    detail: message,
    life: 3000,
  });
};

const SNotification: React.FC = () => {
  const toastRef = useRef<Toast>(null);

  useEffect(() => {
    toastTopCenterRef = toastRef;
  }, []);

  return <Toast ref={toastRef} position="top-center" />;
};

export default SNotification;
