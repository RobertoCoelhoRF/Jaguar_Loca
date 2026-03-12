import React from 'react'
import '../styles/Modal.css'

export default function Modal({ 
  isOpen, 
  title, 
  message, 
  type = 'info', // 'info', 'success', 'error', 'warning', 'confirm'
  onClose, 
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancelar'
}) {
  if (!isOpen) return null

  const handleConfirm = () => {
    if (onConfirm) onConfirm()
    else onClose()
  }

  const isConfirm = type === 'confirm'

  return (
    <div className="modal-overlay">
      <div className={`modal-content modal-${type}`}>
        {title && <h3 className="modal-title">{title}</h3>}
        <p className="modal-message">{message}</p>
        <div className="modal-buttons">
          {isConfirm ? (
            <>
              <button className="modal-btn modal-btn-primary" onClick={handleConfirm}>
                {confirmText}
              </button>
              <button className="modal-btn modal-btn-secondary" onClick={onClose}>
                {cancelText}
              </button>
            </>
          ) : (
            <button className="modal-btn modal-btn-primary" onClick={onClose}>
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
