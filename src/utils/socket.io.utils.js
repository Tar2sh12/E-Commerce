import {Server} from "socket.io"
// establish socket connection
let io = null;
export const socketConnection = (server) => {
    io= new Server(server,{
        cors:{
            origin:'*'
        }
    })
    return io;
}

// return io parameter 
export const getIo = () => {
    return io;
}