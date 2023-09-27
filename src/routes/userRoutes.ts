import koa from "koa";
import Router from "koa-router";

import fs from 'fs';
import path from "path";
import axios from "axios";
import nunjucks from "nunjucks";

import printObjectDataInColumns from '../utils/printObjectDataInColumns';

const userRouter = new Router();

const baseUrl = `https://oss.x-lab.info/open_digger/github/`;

const resultPath = path.join(__dirname, '../../public/result.html');
const result = nunjucks.compile(fs.readFileSync(resultPath, 'utf-8'));

// 访问根路径时展示页面
userRouter.get("/", async(ctx: any, next: any) => {
    ctx.type = 'html';
    ctx.body = fs.createReadStream(path.join(__dirname, '../../public/form.html'));
})

// 处理表单提交
userRouter.post("/submit", async(ctx: any, next: any) => {
    const formData = ctx.request.body;
    const repository = formData.repository;
    const metric = formData.metric;
    const {data} = await axios.get(baseUrl + `${repository}/${metric}.json`);
    const dataStr = printObjectDataInColumns(data);
    const formattedData = dataStr.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;').replace(/\n/g, '<br/>');
    // const combinedStr = repository + metric;

    const html = result.render({dataStr});
    console.log('data', data)
    console.log(dataStr)
    console.log(formattedData)
    console.log('resultpath', resultPath)
    ctx.type = 'html';
    ctx.body = html;
})

export default userRouter;