import React, { useState } from 'react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, itemName }) => {
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const isValid = input.toLowerCase() === 'delete';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Are you sure you want to delete {itemName || 'this item'}?</h2>
        <p className="text-sm text-gray-600 mb-4">This action cannot be undone. To confirm, please type <strong>delete</strong>.</p>

        <input
          type="text"
          className="w-full p-2 border rounded mb-4"
          placeholder="Type delete to confirm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded ${isValid ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-200 text-gray-500 cursor-not-allowed'}`}
            disabled={!isValid}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
