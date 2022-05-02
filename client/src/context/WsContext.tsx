import React, { useContext, createContext, useMemo, useEffect, useState } from 'react';
import { Manager, Socket } from 'socket.io-client';

type WSContextType = {
  emit: (event: string, data?: any) => Promise<void>;
  on: (event: string, callback: (arg0?: any) => any) => Promise<void>;
};

const WSContext = createContext<WSContextType>({
  emit: async (event: string, data?: any) => {},
  on: async (event: string, callback: (arg0?: any) => any) => {},
});

const { Provider } = WSContext;

export const WSProvider: React.FC = function ({ children }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    console.log('process.env.REACT_APP_WS_API_DOMAIN: ', process.env.REACT_APP_WS_API_DOMAIN);
    const mng = new Manager(process.env.REACT_APP_WS_API_DOMAIN, {
      autoConnect: false,
      transports: ['websocket'],
    });

    mng.connect();
    setSocket(mng.socket('/'));

    return () => {
      socket?.disconnect();
    };
  }, []);

  const value = useMemo(
    () => ({
      emit: async (event: string, data) => {
        await socket?.emit(event, data);
      },
      on: async (event: string, callback: (arg0?: any) => any) => {
        await socket?.on(event, callback());
      },
    }),
    [],
  );
  return <Provider value={value}>{children}</Provider>;
};

export function useWebSockets() {
  const context = useContext(WSContext);
  if (context === undefined) {
    throw new Error('The component this hook must be a descendant of the AuthProvider');
  }
  return context;
}
