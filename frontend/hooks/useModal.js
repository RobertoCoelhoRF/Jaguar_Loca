import React, { useState, useCallback } from 'react'

export const useModal = () => {
  const [modals, setModals] = useState([])

  const show = useCallback((config) => {
    const id = Date.now()
    const modal = {
      id,
      title: config.title || '',
      message: config.message || '',
      type: config.type || 'info',
      confirmText: config.confirmText || 'OK',
      cancelText: config.cancelText || 'Cancelar',
      inputType: config.inputType || 'text',
      inputPlaceholder: config.inputPlaceholder || '',
      onConfirm: config.onConfirm || null,
      onCancel: config.onCancel || null
    }
    setModals(prev => [...prev, modal])
    return id
  }, [])

  const close = useCallback((id) => {
    setModals(prev => prev.filter(m => m.id !== id))
  }, [])

  const closeAll = useCallback(() => {
    setModals([])
  }, [])

  const alert = useCallback((message, type = 'info') => {
    return show({
      message,
      type,
      confirmText: 'OK'
    })
  }, [show])

  const success = useCallback((message, title = 'Sucesso') => {
    return show({
      title,
      message,
      type: 'success',
      confirmText: 'OK'
    })
  }, [show])

  const error = useCallback((message, title = 'Erro') => {
    return show({
      title,
      message,
      type: 'error',
      confirmText: 'OK'
    })
  }, [show])

  const confirm = useCallback((message, onConfirm, title = 'Confirmar', confirmText = 'Sim', cancelText = 'Cancelar') => {
    return show({
      title,
      message,
      type: 'confirm',
      confirmText,
      cancelText,
      onConfirm
    })
  }, [show])

  const warning = useCallback((message, title = 'Aviso') => {
    return show({
      title,
      message,
      type: 'warning',
      confirmText: 'OK'
    })
  }, [show])

  const prompt = useCallback((message, onConfirm, title = '', inputType = 'text', inputPlaceholder = '', confirmText = 'Confirmar', cancelText = 'Cancelar') => {
    return show({
      title,
      message,
      type: 'prompt',
      confirmText,
      cancelText,
      inputType,
      inputPlaceholder,
      onConfirm
    })
  }, [show])

  return {
    modals,
    show,
    close,
    closeAll,
    alert,
    success,
    error,
    confirm,
    warning,
    prompt
  }
}
