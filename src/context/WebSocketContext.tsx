import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from './AuthContext';

interface WebSocketContextType {
  lastMessage: any;
  sendMessage: (msg: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [lastMessage, setLastMessage] = useState<any>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}`);

    socket.onopen = () => {
      console.log('WebSocket connected');
      if (user) {
        socket.send(JSON.stringify({ type: 'auth', userId: user.id }));
      }
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLastMessage(data);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, [user]);

  const sendMessage = (msg: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    }
  };

  return (
    <WebSocketContext.Provider value={{ lastMessage, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
