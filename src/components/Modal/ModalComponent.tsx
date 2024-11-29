import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, content, onClose }) => {
  if (!isOpen) return null;

  const closeModal = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-800 bg-opacity-50 z-9999"
        style={{ backgroundColor: 'rgba(128, 128, 128, 0.2)' }}
        onClick={closeModal}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-99999">
        <div className="modal rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-auto max-w-4xl w-full relative mx-4">
          <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
            <div className="w-full flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
              <button
                className="text-xl font-bold text-gray-600 dark:text-white"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>
          </div>
          <div className="p-7 h-full">
            {content}
          </div>
        </div>
      </div>

    </>
  );
};

export default Modal;
