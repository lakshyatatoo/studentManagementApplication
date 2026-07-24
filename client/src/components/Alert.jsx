import { useState } from 'react';

const Alert = ({ message, type = 'success', onClose }) => {
  const [visible, setVisible] = useState(true);

  if (!visible || !message) return null;

  return (
    <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
      {message}
      <button
        type="button"
        className="btn-close"
        onClick={() => {
          setVisible(false);
          onClose?.();
        }}
      ></button>
    </div>
  );
};

export default Alert;
