'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Copy, ChevronDown, ChevronUp } from 'lucide-react'
import dynamic from 'next/dynamic'
import React from 'react'
import { useColorMode } from '@docusaurus/theme-common'

const CodeEditor = dynamic(
  () => import('react-simple-code-editor').then((mod) => mod.default),
  { ssr: false }
)

import Prism from 'prismjs'
import 'prismjs/components/prism-json'

interface WebSocketTesterProps {
  url: string;
  startingFilter: object;
  text: string;
}

export default function WebSocketTester({ url, startingFilter, text }: WebSocketTesterProps) {
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<{ type: 'sent' | 'received' | 'error', content: string }[]>([])
  const [inputMessage, setInputMessage] = useState(JSON.stringify(startingFilter, null, 2))
  const [filterSent, setFilterSent] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(true)
  const socketRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { isDarkTheme } = useColorMode()

  useEffect(() => {
    if (messagesEndRef.current) {
      const messagesContainer = messagesEndRef.current.parentElement
      if (messagesContainer) {
        messagesContainer.scrollTo({
          top: messagesContainer.scrollHeight,
          behavior: 'smooth'
        })
      }
    }
  }, [messages])

  const connect = () => {
    if (socketRef.current) {
      socketRef.current.close()
    }

    const socket = new WebSocket(url)

    socket.onopen = () => {
      setConnected(true)
      setFilterSent(false)
      addMessage('sent', 'Connected to WebSocket server')
    }

    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data)
        addMessage('received', JSON.stringify(parsed, null, 2))
      } catch {
        addMessage('received', event.data)
      }
    }

    socket.onclose = () => {
      setConnected(false)
      addMessage('sent', 'Disconnected from WebSocket server')
    }

    socket.onerror = (error) => {
      addMessage('error', `Error: ${error}`)
    }

    socketRef.current = socket
  }

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.close()
    }
  }

  const sendMessage = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && !filterSent) {
      try {
        const parsed = JSON.parse(inputMessage)
        socketRef.current.send(JSON.stringify(parsed))
        addMessage('sent', JSON.stringify(parsed, null, 2))
        setFilterSent(true)
      } catch (error) {
        addMessage('error', 'Invalid JSON format')
      }
    } else if (filterSent) {
      addMessage('error', 'Filter already sent. Reconnect to send again.')
    } else {
      addMessage('error', 'Not connected to a WebSocket server')
    }
  }

  const addMessage = (type: 'sent' | 'received' | 'error', content: string) => {
    setMessages(prev => [...prev, { type, content }])
  }

  const clearLogs = () => {
    setMessages([])
  }

  const prettifyJSON = () => {
    try {
      const parsed = JSON.parse(inputMessage)
      setInputMessage(JSON.stringify(parsed, null, 2))
    } catch (error) {
      addMessage('error', 'Invalid JSON format')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard')
    }).catch(err => {
      console.error('Failed to copy: ', err)
    })
  }

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close()
      }
    }
  }, [])

  const highlightCode = (code: string) => {
    return Prism.highlight(code, Prism.languages.json, 'json')
  }

  return (
    <Card
      className={`w-full max-w-2xl mx-auto border transition-colors
        bg-[var(--ifm-background-color)]
        border-[var(--ifm-color-emphasis-300)]
        text-[var(--ifm-font-color-base)]
        ${isCollapsed ? 'cursor-pointer hover:bg-[var(--ifm-hover-overlay)] pb-4' : ''}`}
      onClick={() => isCollapsed && setIsCollapsed(false)}
    >
      <CardHeader
        className="flex flex-row items-center justify-between space-y-0 pb-2"
        onClick={(e) => {
          e.stopPropagation()
          setIsCollapsed(!isCollapsed)
        }}
      >
        <CardTitle className="text-xl text-[var(--ifm-font-color-base)]">{text}</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-[var(--ifm-color-emphasis-600)] hover:text-[var(--ifm-font-color-base)] hover:bg-[var(--ifm-hover-overlay)]"
        >
          {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </Button>
      </CardHeader>
      {!isCollapsed && (
        <CardContent
          className="space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex space-x-2">
            <div className="flex-grow p-2 bg-[var(--ifm-background-surface-color)] rounded-md font-mono text-sm flex items-center justify-between">
              <span>{url}</span>
              <Button
                onClick={() => copyToClipboard(url)}
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-[var(--ifm-color-emphasis-600)] hover:text-[var(--ifm-font-color-base)] hover:bg-[var(--ifm-hover-overlay)]"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={connected ? disconnect : connect}
              className={`text-white hover:text-white ${connected
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-[#2e8555] hover:bg-[#2b7b4f]'
                }`}
            >
              {connected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Filter:</label>
              <Button
                onClick={() => copyToClipboard(inputMessage)}
                variant="ghost"
                size="sm"
                className="text-[var(--ifm-color-emphasis-600)] hover:text-[var(--ifm-font-color-base)] hover:bg-[var(--ifm-hover-overlay)]"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <div className="rounded-md overflow-hidden border border-[var(--ifm-color-emphasis-300)]">
              <CodeEditor
                value={inputMessage}
                onValueChange={setInputMessage}
                highlight={highlightCode}
                padding={10}
                style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                  fontSize: 14,
                  backgroundColor: isDarkTheme ? '#2e2e2e' : '#f6f8fa',
                  color: isDarkTheme ? '#e3e3e3' : '#1c1e21',
                  minHeight: 120,
                }}
                className="min-h-[120px]"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={sendMessage}
                disabled={!connected || filterSent}
                className="bg-[#2e8555] hover:bg-[#2b7b4f] text-white hover:text-white disabled:bg-gray-400 dark:disabled:bg-gray-700"
              >
                {filterSent ? 'Filter Sent' : 'Send Filter'}
              </Button>
              <Button
                onClick={prettifyJSON}
                className="bg-[#2e8555] hover:bg-[#2b7b4f] text-white hover:text-white"
              >
                Prettify
              </Button>
            </div>
          </div>
          <div className="border border-[var(--ifm-color-emphasis-300)] rounded-md overflow-hidden">
            {messages.length > 0 ? (
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full table-fixed m-0">
                  <colgroup>
                    <col className="w-20" />
                    <col className="w-[calc(100%-5rem)]" />
                  </colgroup>
                  <tbody>
                    {messages.map((message, index) => (
                      <tr
                        key={index}
                        className={`${message.type === 'error'
                          ? 'bg-red-100 dark:bg-red-900'
                          : index % 2 === 0
                            ? 'bg-[var(--ifm-background-color)]'
                            : 'bg-[var(--ifm-background-surface-color)]'
                          } w-full`}
                      >
                        <td className="p-2 text-[var(--ifm-color-emphasis-600)] font-medium border-r border-[var(--ifm-color-emphasis-300)]">
                          {message.type === 'sent'
                            ? 'Client'
                            : message.type === 'received'
                              ? 'Server'
                              : 'Error'}
                        </td>
                        <td className="p-2 break-all w-full">
                          <pre className="font-mono text-sm whitespace-pre-wrap break-words text-[var(--ifm-font-color-base)] w-full">
                            {message.content}
                          </pre>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="p-4 text-center text-[var(--ifm-color-emphasis-600)]">
                No messages yet
              </div>
            )}
          </div>
          <Button
            onClick={clearLogs}
            className="bg-yellow-600 hover:bg-yellow-700 text-white hover:text-white"
          >
            Clear Logs
          </Button>
          <p className="text-sm text-[var(--ifm-color-emphasis-600)]">
            Status: {connected ? 'Connected' : 'Disconnected'}
          </p>
        </CardContent>
      )}
    </Card>
  )
}

