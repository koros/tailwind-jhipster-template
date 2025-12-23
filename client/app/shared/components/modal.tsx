import React from 'react';

interface ModalProps {
  isOpen: boolean;
  toggle: (event?: any) => void;
  children: React.ReactNode;
  backdrop?: string;
  id?: string;
  autoFocus?: boolean;
}

interface ModalHeaderProps {
  toggle?: (event?: any) => void;
  children: React.ReactNode;
  id?: string;
  'data-cy'?: string;
}

interface ModalBodyProps {
  id?: string;
  children: React.ReactNode;
}

interface ModalFooterProps {
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, toggle, children, id }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true" id={id}>
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={toggle}></div>

        {/* Center modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-card rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export const ModalHeader: React.FC<ModalHeaderProps> = ({ toggle, children, id, 'data-cy': dataCy }) => {
  return (
    <div className="bg-card px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-primary">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-primary" id={id || 'modal-title'} data-cy={dataCy}>
          {children}
        </h3>
        {toggle && (
          <button type="button" className="text-secondary hover:text-primary focus:outline-none" onClick={toggle}>
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export const ModalBody: React.FC<ModalBodyProps> = ({ id, children }) => {
  return (
    <div id={id} className="bg-card px-4 pt-5 pb-4 sm:p-6">
      {children}
    </div>
  );
};

export const ModalFooter: React.FC<ModalFooterProps> = ({ children }) => {
  return <div className="bg-surface px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">{children}</div>;
};
