import React, { useState } from 'react'
import '../styles/Modal.css'

export default function Modal({ 
  isOpen, 
  title, 
  message, 
  type = 'info', // 'info', 'success', 'error', 'warning', 'confirm'
  onClose, 
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancelar',
  inputConfig = null // { placeholder, type, label }
}) {
  const [inputValue, setInputValue] = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    if (onConfirm) onConfirm(inputConfig ? inputValue : undefined)
    else onClose()
  }

  const hasActions = type === 'confirm' || inputConfig !== null

  return (
    <div className="modal-overlay">
      <div className={`modal-content modal-${type}`}>
        {title && <h3 className="modal-title">{title}</h3>}
        <p className="modal-message">{message}</p>
        {inputConfig && (
          <div className="modal-input-wrapper">
            {inputConfig.label && (
              <label className="modal-input-label">{inputConfig.label}</label>
            )}
            <input
              className="modal-input"
              type={inputConfig.type || 'text'}
              placeholder={inputConfig.placeholder || ''}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleConfirm() }}
              autoFocus
            />
          </div>
        )}
        <div className="modal-buttons">
          {hasActions ? (
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
