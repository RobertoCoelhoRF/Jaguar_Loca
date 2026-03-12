import React, { useState } from 'react'
import '../styles/Modal.css'

export default function Modal({ 
  isOpen, 
  title, 
  message, 
  type = 'info', // 'info', 'success', 'error', 'warning', 'confirm', 'prompt'
  onClose, 
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancelar',
  inputType = 'text',
  inputPlaceholder = ''
}) {
  const [inputValue, setInputValue] = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    if (onConfirm) {
      if (type === 'prompt') onConfirm(inputValue)
      else onConfirm()
    } else {
      onClose()
    }
  }

  const isConfirm = type === 'confirm'
  const isPrompt = type === 'prompt'

  return (
    <div className="modal-overlay">
      <div className={`modal-content modal-${isPrompt ? 'info' : type}`}>
        {title && <h3 className="modal-title">{title}</h3>}
        <p className="modal-message">{message}</p>
        {isPrompt && (
          <input
            className="modal-input"
            type={inputType}
            placeholder={inputPlaceholder}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleConfirm() }}
            autoFocus
          />
        )}
        <div className="modal-buttons">
          {(isConfirm || isPrompt) ? (
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
