import React from 'react'
import Modal from './Modal'

export default function ModalContainer({ modals, onClose }) {
  return (
    <>
      {modals.map(modal => (
        <Modal
          key={modal.id}
          isOpen={true}
          title={modal.title}
          message={modal.message}
          type={modal.type}
          confirmText={modal.confirmText}
          cancelText={modal.cancelText}
          inputConfig={modal.inputConfig || null}
          onConfirm={(value) => {
            if (modal.onConfirm) {
              modal.onConfirm(value)
            }
            onClose(modal.id)
          }}
          onClose={() => {
            if (modal.onCancel) {
              modal.onCancel()
            }
            onClose(modal.id)
          }}
        />
      ))}
    </>
  )
}
