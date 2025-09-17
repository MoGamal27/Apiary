import express from 'express';
import http from 'http';
import mainRoutes from './src/Routes/index';
import globalError from './src/middleware/errorMiddleware';
import limiter from './src/middleware/rateLimit';
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();
const server = http.createServer(app);



app.use(
  cors({
    origin: "*",
  })
);
app.use(cookieParser());

app.use(express.json());
app.use('/api', mainRoutes);

app.use(globalError);
app.use(limiter);

server.listen(3000, () => {
  console.log('Server up and running on port: 3000');
});

export default server;
