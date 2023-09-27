//引入Koa
import koa from "koa";
import logger from "koa-logger";
import json from "koa-json";
import bodyParser from "koa-bodyparser";

import userRouter from "./routes/userRoutes";

const app = new koa();


//配置中间件
app.use(json());
app.use(logger());
app.use(bodyParser());

// use routes
app.use(userRouter.routes()).use(userRouter.allowedMethods());

//监听端口
app.listen(3006, () => {
    console.log('Koa started.')
});
