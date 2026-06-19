import { createContext, useContext, useState, useCallback, useRef } from "react";
import StatusMessage from "../components/StatusMessage/StatusMessage";

const StatusContext = createContext(null);

export function StatusProvider({ children }) {
  const [status, setStatus] = useState(null);
  const idRef = useRef(0);

  const showStatus = useCallback((next) => {
    idRef.current += 1;
    setStatus({ ...next, key: idRef.current });
  }, []);

  const dismiss = useCallback(() => setStatus(null), []);

  return (
    <StatusContext.Provider value={{ showStatus }}>
      {children}
      {status && (
        <StatusMessage
          key={status.key}
          variant={status.variant}
          title={status.title}
          message={status.message}
          duration={status.duration}
          onDismiss={dismiss}
        />
      )}
    </StatusContext.Provider>
  );
}

export function useStatus() {
  const ctx = useContext(StatusContext);
  if (!ctx) throw new Error("useStatus must be used within a StatusProvider");
  return ctx;
}