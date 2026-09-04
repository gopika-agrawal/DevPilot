import { createContext, useContext, useEffect, useState } from "react";
import {
  CircleCheck,
  Info,
  TriangleAlert,
  CircleX,
  LoaderCircle,
  X,
} from "lucide-react";

const ToastContext = createContext(null);

let toastId = 0;

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function addToast({
    title,
    description,
    type = "info",
    duration = 4000,
  }) {
    const id = ++toastId;

    setToasts((current) => [
      ...current,
      {
        id,
        title,
        description,
        type,
      },
    ]);

    if (duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }

  function removeToast(id) {
    setToasts((current) =>
      current.filter((toast) => toast.id !== id)
    );
  }

  const toast = {
    add: addToast,

    promise(promise, messages) {
      addToast({
        ...messages.loading,
      });

      return promise
        .then((result) => {
          if (messages.success) {
            const success =
              typeof messages.success === "function"
                ? messages.success(result)
                : messages.success;

            addToast(success);
          }

          return result;
        })
        .catch((error) => {
          if (messages.error) {
            const errorToast =
              typeof messages.error === "function"
                ? messages.error(error)
                : messages.error;

            addToast(errorToast);
          }

          throw error;
        });
    },
  };

  return (
    <ToastContext.Provider
      value={{
        toast,
        removeToast,
      }}
    >
      {children}

      <ToastViewport>
        {toasts.map((toastItem) => (
          <Toast
            key={toastItem.id}
            toast={toastItem}
            onClose={() => removeToast(toastItem.id)}
          />
        ))}
      </ToastViewport>
    </ToastContext.Provider>
  );
}

function useToastManager() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToastManager must be used inside ToastProvider"
    );
  }

  return context;
}

function ToastViewport({ children }) {
  return (
    <div className="toast-viewport">
      {children}
    </div>
  );
}

function Toast({ toast, onClose }) {
  const { title, description, type } = toast;

  return (
    <div className={`toast toast-${type}`}>
      <ToastIcon type={type} />

      <div className="toast-content">
        {title && (
          <div className="toast-title">
            {title}
          </div>
        )}

        {description && (
          <div className="toast-description">
            {description}
          </div>
        )}
      </div>

      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={15} />
      </button>
    </div>
  );
}

function ToastIcon({ type }) {
  switch (type) {
    case "success":
      return (
        <CircleCheck
          size={19}
          className="toast-icon-success"
        />
      );

    case "info":
      return (
        <Info
          size={19}
          className="toast-icon-info"
        />
      );

    case "warning":
      return (
        <TriangleAlert
          size={19}
          className="toast-icon-warning"
        />
      );

    case "error":
      return (
        <CircleX
          size={19}
          className="toast-icon-error"
        />
      );

    case "loading":
      return (
        <LoaderCircle
          size={19}
          className="toast-icon-loading"
        />
      );

    default:
      return <Info size={19} />;
  }
}

/*
 * This is the global toast manager used by hooks
 * such as useStartIndexing() and useRefreshRepos().
 */
const globalToastListeners = new Set();

const toast = {
  add(config) {
    globalToastListeners.forEach((listener) => {
      listener.add(config);
    });
  },

  promise(promise, messages) {
    toast.add(messages.loading);

    return promise
      .then((result) => {
        const success =
          typeof messages.success === "function"
            ? messages.success(result)
            : messages.success;

        toast.add(success);

        return result;
      })
      .catch((error) => {
        const errorToast =
          typeof messages.error === "function"
            ? messages.error(error)
            : messages.error;

        toast.add(errorToast);

        throw error;
      });
  },
};

function GlobalToastBridge() {
  const { toast: managerToast } = useToastManager();

  useEffect(() => {
    globalToastListeners.add(managerToast);

    return () => {
      globalToastListeners.delete(managerToast);
    };
  }, [managerToast]);

  return null;
}

function Toaster({ children }) {
  return (
    <ToastProvider>
      <GlobalToastBridge />
      {children}
    </ToastProvider>
  );
}

export {
  toast,
  Toaster,
  Toast,
  ToastProvider,
  ToastViewport,
  useToastManager,
};