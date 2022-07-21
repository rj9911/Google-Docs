import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import { createServer } from "http";

import Connection from "./database/db.js";

import { getDocument, updateDocument } from "./controller/document-controller.js";

const PORT = process.env.PORT || 9000;

const URL = process.env.MONGODB_URI || `mongodb://priyam3955:Nehagupta@ac-tfkxepa-shard-00-00.hbyfxn1.mongodb.net:27017,ac-tfkxepa-shard-00-01.hbyfxn1.mongodb.net:27017,ac-tfkxepa-shard-00-02.hbyfxn1.mongodb.net:27017/?ssl=true&replicaSet=atlas-hyvm2w-shard-0&authSource=admin&retryWrites=true&w=majority`;

Connection(URL);

const app = express();

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

const httpServer = createServer(app);
httpServer.listen(PORT);

const io = new Server(httpServer);

io.on('connection', socket => {
    socket.on('get-document', async documentId => {
        const document = await getDocument(documentId);
        socket.join(documentId);
        socket.emit('load-document',document.data);

        socket.on('send-changes', async delta => {
          await socket.broadcast.to(documentId).emit('receive-changes', delta);
        });

        socket.on('save-document', async data => {
            await updateDocument(documentId, data)
        });
    });           
});
