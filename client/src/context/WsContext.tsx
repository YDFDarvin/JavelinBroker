import React, { useContext, createContext, useMemo, useEffect, useState } from 'react';
import { Manager, Socket } from 'socket.io-client';
import { useSnackbar } from 'notistack';

type WSContextType = {
  emit: (event: string, data?: any) => Promise<void>;
  on: (event: string, callback: (arg0?: any) => any) => Promise<void>;
  socket: Socket | null;
};

const WSContext = createContext<WSContextType>({
  emit: async (event: string, data?: any) => {},
  on: async (event: string, callback: (arg0?: any) => any) => {},
  socket: null,
});

const { Provider } = WSContext;

export const WSProvider: React.FC = function ({ children }) {
  const { enqueueSnackbar } = useSnackbar();

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const manager = new Manager(process.env.REACT_APP_WS_API_DOMAIN, {
      autoConnect: true,
      transports: ['websocket'],
    });

    const newSocket = manager.socket('/');
    setSocket(newSocket);

    manager.open((err) => {
      if (err) {
        enqueueSnackbar(`Connection has failed: ${err}`, { variant: 'error' });
        console.error('Error occurred: ', err);
      } else {
        enqueueSnackbar(`Connection has succeeded: ${err}`, { variant: 'error' });
        console.log('Connection has succeeded!');
      }
    });

    return () => {
      newSocket?.disconnect();
      newSocket.close();
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
      socket: socket,
    }),
    [socket],
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
