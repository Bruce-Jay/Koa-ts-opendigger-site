import koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import cors from "koa2-cors";
import jwt from "jsonwebtoken";

import fs from "fs";
import path from "path";
import axios from "axios";
import nunjucks from "nunjucks";

import { pool, query } from "../utils/mysqlConf";

const userRouter = new Router();
userRouter.use(cors());
userRouter.use(bodyParser());

interface User {
    id: number;
    username: string;
}


const baseUrl = `https://oss.x-lab.info/open_digger/github/`;

// 用户数据库模拟
const users = [{ id: 1, username: "123", password: "123" }];

// 处理表单提交
userRouter.post("/submit", async (ctx: any, next: any) => {
    const formData = ctx.request.body;
    console.log(formData);
    const repository = formData.repository; 
    const metric = formData.metric;
    const { data } = await axios.get(baseUrl + `${repository}/${metric}.json`);

    ctx.status = 200;
    ctx.body = data;
});

userRouter.post("/loginVerify", async (ctx: any) => {
    const { username, password } = ctx.request.body;

    // 查询数据库中的用户信息
    try {
        // const user = await query(
        //     dbPool,
        //     "SELECT * FROM users WHERE username = ? AND password = ?",
        //     [username, password]
        // );
        const user: User = await new Promise((resolve, reject) => {
            return query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err: any, rows: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })})
        if (Object.values(user).length > 0) {
            const token = jwt.sign(
                { userId: user.id, username: user.username },
                "your-secret-key"
            );
            ctx.body = token;
        } else {
            ctx.status = 200;
            ctx.body = { error: "incorrect" };
        }
        // ctx.body = user;
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: "数据库查询出错" };
    }
});

userRouter.post("/register", async (ctx: any, next: any) => {
    const { newUsername, newPassword } = ctx.request.body;

    // 查询数据库中的用户信息, 如果存在则返回错误信息
    try {
        // const user = await query(
        //     dbPool,
        //     "SELECT * FROM users WHERE username = ?",
        //     [newUsername]
        // );
        const user: any = await new Promise((resolve, reject) => {
            return query('SELECT * FROM users WHERE username = ?', [newUsername], (err: any, rows: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })})
        
        // await next();
        
        if (user.length > 0) {
            ctx.status = 200;
            ctx.body = { error: "existed" };
        } else {
            // const newUser = await query(
            //     dbPool,
            //     "INSERT INTO users (username, password) VALUES (?, ?)",
            //     [newUsername, newPassword]
            // );
            const newUser = await new Promise((resolve, reject) => {
                return query('INSERT INTO users (username, password) VALUES (?, ?)', [newUsername, newPassword], (err: any, rows: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                })})
            console.log('用户已创建');
            // await next();
            ctx.status = 200;
            ctx.body = newUser;
        }
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: "数据库查询出错" };
    }
});

export default userRouter;
