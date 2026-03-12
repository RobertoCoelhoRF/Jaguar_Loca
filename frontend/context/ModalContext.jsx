import React, { createContext, useContext } from 'react'
import { useModal } from '../hooks/useModal'

const ModalContext = createContext()

export const ModalProvider = ({ children }) => {
  const modal = useModal()

  return (
    <ModalContext.Provider value={modal}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModalContext = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModalContext deve ser usado dentro de ModalProvider')
  }
  return context
}
