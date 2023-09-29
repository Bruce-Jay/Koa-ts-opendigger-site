import koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import cors from "koa2-cors";

import fs from "fs";
import path from "path";
import axios from "axios";
import nunjucks from "nunjucks";

const userRouter = new Router();
userRouter.use(cors())
userRouter.use(bodyParser())

const baseUrl = `https://oss.x-lab.info/open_digger/github/`;


// 处理表单提交
userRouter.post("/submit", async (ctx: any, next: any) => {
    const formData = ctx.request.body;
    const repository = formData.repository;
    const metric = formData.metric;
    const { data } = await axios.get(baseUrl + `${repository}/${metric}.json`);

    ctx.status = 200;
    ctx.body = data;
});

export default userRouter;
