//引入Koa
import koa from "koa";
import logger from "koa-logger";
import json from "koa-json";
import bodyParser from "koa-bodyparser";
import cors from "koa2-cors";

import userRouter from "./routes/userRoutes";

const app = new koa();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//配置中间件
app.use(json());
app.use(logger());
app.use(bodyParser());

// use routes
app.use(userRouter.routes()).use(userRouter.allowedMethods());

// 配置跨域
app.use(cors({
    origin: "*", // 前端地址
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 设置所允许的HTTP请求方法
    // credentials: true, // 标示该响应是合法的
}))

//监听端口
app.listen(3006, () => {
    console.log('Koa started.')
});
