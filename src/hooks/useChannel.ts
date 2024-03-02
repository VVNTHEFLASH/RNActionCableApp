import { ChannelNameWithParams, Consumer } from '@rails/actioncable';
import React, { useState, useEffect, useRef } from 'react'

// Needed for @rails/actioncable
global.addEventListener = () => {};
global.removeEventListener = () => {};

export default function useChannel(actionCable: Consumer | ChannelNameWithParams) {
  const [connected, setConnected] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const channelRef = useRef<ChannelNameWithParams | null>(null)

  const subscribe = (data: ChannelNameWithParams, callbacks: { received: (arg0: any) => void; initialized: () => void; connected: () => void; disconnected: () => void; }) => {
    console.log(`useChannel - INFO: Connecting to ${data.channel}`)
    const channel = actionCable.subscriptions.create(data, {
      received: (x: any) => {
        if (callbacks.received) callbacks.received(x)
      },
      initialized: () => {
        console.log('useChannel - INFO: Init ' + data.channel)
        setSubscribed(true)
        if (callbacks.initialized) callbacks.initialized()
      },
      connected: () => {
        console.log('useChannel - INFO: Connected to ' + data.channel)
        setConnected(true)
        if (callbacks.connected) callbacks.connected()
      },
      disconnected: () => {
        console.log('useChannel - INFO: Disconnected')
        setConnected(false)
        if (callbacks.disconnected) callbacks.disconnected()
      }
    })
    channelRef.current = channel
  }

  useEffect(() => {
    return () => {
      unsubscribe()
    }
  }, [])
  
  const unsubscribe = () => {
    setSubscribed(false)
    if(channelRef.current) {
      console.log('useChannel - INFO: Unsubscribing from ' + channelRef.current.identifier)
      actionCable.subscriptions.remove(channelRef.current)

      channelRef.current = null
    }
  }

  const send = (type: any, payload: any) => {
    if (subscribed && !connected) throw 'useChannel - ERROR: not connected'
    if (!subscribed) throw 'useChannel - ERROR: not subscribed'
    try {
        if(channelRef && channelRef.current) {
            channelRef.current.perform(type, payload)
        }
    } catch (e) {
      throw 'useChannel - ERROR: ' + e
    }
  }
  
  return {subscribe, unsubscribe, send}
}