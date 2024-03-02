import React, { useEffect, useMemo } from 'react'
import { createConsumer } from '@rails/actioncable'

export default function useActionCable(url: string) {
  const actionCable = useMemo(() => createConsumer(url), [])

  useEffect(() => {
    return () => {
      console.log('Disconnect Action Cable')
      actionCable.disconnect()
    }
  }, [])

  return { actionCable }
}