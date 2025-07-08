import { useState } from 'react'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification = { ...notification, id }
    
    setNotifications(prev => [...prev, newNotification])
    
    // Auto-remove after duration (default: 5000ms)
    setTimeout(() => {
      removeNotification(id)
    }, notification.duration || 5000)
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const success = (title: string, message: string, duration?: number) => {
    addNotification({ type: 'success', title, message, duration })
  }

  const error = (title: string, message: string, duration?: number) => {
    addNotification({ type: 'error', title, message, duration })
  }

  const warning = (title: string, message: string, duration?: number) => {
    addNotification({ type: 'warning', title, message, duration })
  }

  const info = (title: string, message: string, duration?: number) => {
    addNotification({ type: 'info', title, message, duration })
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  }
} 