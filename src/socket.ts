import { io } from 'socket.io-client'

export const socket = io('https://srv-d61kp23uibrs73e11d30.onrender.com', {
  transports: ['websocket']
})
