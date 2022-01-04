import * as path from "path";
import * as nodemailer from "nodemailer";
import * as bodyParser from "body-parser";
import Redis from 'ioredis';

import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

import { dbConn } from "./dbConnection";
import { Message } from "./message";
import {
  Status, MethodType, Func, registerMailContent, log, RunOpts,
  validatePassword, validateEmail, noNeedVerify, isVerify
} from "../common/utils";
import { SmtpConfig, redisConfig } from "../tsl/config";
import { createRedisClient, RedisKeys } from "./util";
// import { SIGQUIT } from "constants";

const Apis = MethodType;
console.log("Apis", Apis);

const rowData = ({ userId, name, type }) => ({ userId, name, type });


function getBaseUrl() {
  const DefaultAPI = "https://localhost:8878";//"https://220.132.71.252:8888";
  let base = process.env.TestBaseUrl || DefaultAPI;
  return base;
}


/**
 * @swagger
 * definitions:
 *   Cache:
 *     type: object
 *     required:
 *       - cacheId
 *     properties:
 *       cacheId:
 *         description: user information cache Id
 *         type: string
 *   UserId:
 *     type: object
 *     required:
 *       - userId
 *     properties:
 *       userId:
 *         description: user email id
 *         type: string
 *   Users:
 *     type: object
 *     required:
 *       - userId
 *       - password
 *       - type
 *     properties:
 *       userId:
 *         description: user email id
 *         type: string
 *       password:
 *         description: user password
 *         type: string
 *       type:
 *         description: login type (GO for google login, FB for facebook login, other for email login)
 *         type: string
 *       name:
 *         description: user full name
 *         type: string
 *   UserProfile:
 *     type: object
 *     required:
 *       - userId
 *       - name
 *     properties:
 *       userId:
 *         description: user email id
 *         type: string
 *       name:
 *         description: user full name
 *         type: string
 *   Password:
 *     type: object
 *     required:
 *       - userId
 *       - password
 *       - newPassword
 *     properties:
 *       userId:
 *         description: user email id
 *         type: string
 *       password:
 *         description: user's old password
 *         type: string
 *       newPassword:
 *         description: user's new password
 *         type: string
 * 
 */


export class ProxyServer {

  /*
    login/register
    google
      userId: mail, name: user name, googleId, type = "GO", tokenObj  
    email
      userId: mail, password, (repassword)
  
  
   */
  isError(resolve, type: MethodType, ret) {
    let { err } = ret;
    if (!err)
      return false;
    const { errno, sqlMessage } = err;
    let status = Status.Error, message = sqlMessage || `${err.code}, ${err.errno}: ${err?.message}`;
    let data: any = { status, message, errno, err };
    if (errno === 1062) { // && type === MethodType.register
      //register no check user exists
      //data.status = Status.UserExists;
      return false;
    }
    this.reply(resolve, data);
    console.error(`sql error:`, err);
    return true;
  }
  reply(resolve, data, userId?) {
    this.formateMessage(data);
    resolve(data);
    if (userId != null) {
      dbConn.updateUserSession(userId);
    }
    return data;
  }
  formateMessage(ret) {
    let code = Status[ret.status], msg = Message[code];
    if (msg) {
      ret.message = msg;
    }
    return ret;
  }
  /*************************************************************************************
   * status : 0: ok, -1:error
   * message
   * errno: if status != 0
   * 
   *************************************************************************************/
  /**
   * proess for SignUp
   */
  validateIdPassword(resolve, { type, userId, password }) {
    const isEmpty = s => typeof userId != "string" || !s;
    if (!noNeedVerify(type)) {
      if (isEmpty(userId) || !validateEmail(userId)) {
        this.reply(resolve, { status: Status.invalidMail }, userId);
        return false;
      }
      if (isEmpty(password) || !validatePassword(password)) {
        this.reply(resolve, { status: Status.invalidPassword });
        return false;
      }
    }
    return true;
  }
  /**
   * @swagger
   * /api/test/register:
   *   post:
   *     tags:
   *     - Test API
   *     description: SignUp to the application
   *     produces:
   *       - application/json
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/Users'
   *     responses:
   *       200:
   *         description: login response
   */
  register(req, res): Promise<any> {
    const mt = MethodType.register;
    let query: any = this.getReq(req), { userId = "", password = "", name, googleId, type, tokenObj } = query;
    return new Promise(async (resolve, reject) => {
      if (this.validateIdPassword(resolve, { type, userId, password }) === false) {
        return;
      }
      let user = await this.queryUser(userId);
      if (user != null) {
        let data: any = { userId, name: user.name || name, type, status: Status.OK };
        return this.reply(resolve, data, userId);
      }
      this.insertUser(resolve, { userId, name, password, googleId, type, tokenObj });
      // dbConn.insertUser({ userId, name, password, googleId, type, tokenObj }).then(ret => {
      //   if (this.isError(resolve, mt, ret)) {
      //     return;
      //   }
      //   let data: any = { userId, name, type, status: Status.OK };
      //   if (!isVerify(type)) {
      //     data.status = Status.VerifyEMail;
      //     this.sendVerifyMail({ userId, password, name }, ret => {
      //       this.reply(resolve, data);
      //     });
      //   }
      //   this.reply(resolve, data);
      // }).catch(err => this.isError(resolve, mt, { err }));
    });
  }
  insertUser(resolve, { userId, name, password, googleId, type, tokenObj }, mt: MethodType = MethodType.register) {
    dbConn.insertUser({ userId, name, password, googleId, type, tokenObj }).then(ret => {
      if (this.isError(resolve, mt, ret)) {
        return;
      }
      let data: any = { userId, name, type, status: Status.OK };
      if (!isVerify(type)) {
        data.status = Status.VerifyEMail;
        this.sendVerifyMail({ userId, password, name }, ret => {
          this.reply(resolve, data, userId);
        });
      }
      this.reply(resolve, data, userId);
    }).catch(err => this.isError(resolve, mt, { err }));

  }
  async queryUser(userId) {
    let ret = await dbConn.queryUser(userId), row;
    if (ret && ret.rows && (row = ret.rows[0]) && row.userId) {
      return row;
    }
    return null;
  }
  /**
   * @swagger
   * /api/test/login:
   *   post:
   *     tags:
   *     - Test API
   *     description: Login to the application
   *     produces:
   *       - application/json
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/Users'
   *     responses:
   *       200:
   *         description: login response
   */
  login(req, res) {
    const mt = MethodType.login;
    let query: any = this.getReq(req), { userId = "", password = "", name, googleId, type = "", tokenObj, cacheId } = query;
    const noVerify = noNeedVerify(type);
    return new Promise(async (resolve, reject) => {
      if (!userId && cacheId) {
        let data = await this.getVerifyMailInfo(cacheId);
        userId = data?.userId;
        password = data?.password;
        name = data?.name;
      } else if (this.validateIdPassword(resolve, { type, userId, password }) === false) {
        return;
      }
      dbConn.queryUser(userId).then(ret => {
        if (this.isError(resolve, mt, ret)) {
          return;
        }
        let { rows = [] } = ret || {}, row, status = Status.OK, param = {};
        if (!rows || rows.length <= 0 || !(row = rows[0]) || !row.userId) {
          if (noVerify) {
            this.insertUser(resolve, { userId, name, password, googleId, type, tokenObj });
            return;
          }
          status = Status.UserNotFound;
        } else if (noVerify) {
          status = Status.OK;
          row.name && (name = row.name);
          param = rowData({ type, userId, name });
        } else if (password != row.password && !noNeedVerify(row.type)) {
          status = Status.IncorrectPassword;
        } else if (!isVerify(row.type, row.status)) {
          param = rowData(row);
          status = Status.VerifyEMail;
        } else {
          param = rowData(row);
        }
        if (status == Status.VerifyEMail || status == Status.OK) {
          dbConn.loginCount(userId);
        }
        let data: any = { ...param, status };
        this.reply(resolve, data, userId);
      }).catch(err => this.isError(resolve, mt, { err }));
    });
  }
  /**
   * @swagger
   * /api/test/resetPassword:
   *   post:
   *     tags:
   *     - Test API
   *     description: proess for reset password
   *     produces:
   *       - application/json
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/Password'
   *     responses:
   *       200:
   *         description: 
   */
  resetPassword(req, res) {
    const mt = MethodType.resetPassword;
    let query: any = this.getReq(req), { userId, password, newPassword } = query;
    return new Promise((resolve, reject) => {
      dbConn.queryUser(userId).then(ret => {
        if (this.isError(resolve, mt, ret)) {
          return;
        }
        let { rows = [] } = ret, row;
        let data: any = { status: Status.OK };
        if (!rows || rows.length <= 0 || !(row = rows[0]) || !row.userId) {
          data.status = Status.UserNotFound;
        } else if (password != row.password && !noNeedVerify(row.type)) {
          data.status = Status.IncorrectPassword;
        } else {
          data = rowData(row);
          return dbConn.updateUser({ userId, password: newPassword }).then(ret => {
            data.status = Status.OK;
            this.reply(resolve, data, userId);
          });
        }
        this.reply(resolve, data, userId);
      }).catch(err => this.isError(resolve, mt, { err }));
    });
  }
  /**
   * @swagger
   * /api/test/updateUserProfile:
   *   post:
   *     tags:
   *     - Test API 
   *     description: proess for user update user profile
   *     produces:
   *       - application/json
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/UserProfile'
   *     responses:
   *       200:
   *         description: 
   */
  updateUserProfile(req, res) {
    const mt = MethodType.updateUserProfile;
    let query: any = this.getReq(req), { userId, name } = query;
    return new Promise((resolve, reject) => {
      dbConn.queryUser(userId).then(ret => {
        if (this.isError(resolve, mt, ret)) {
          return;
        }
        let { rows = [] } = ret, row;
        let data: any = { status: Status.OK };
        if (!rows || rows.length <= 0 || !(data.row = row = rows[0]) || !row.userId) {
          data.status = Status.UserNotFound;
        } else {
          data = rowData(row);
          return dbConn.updateUser({ userId, name }).then(ret => {
            data.status = Status.OK;
            data.name = name;
            this.reply(resolve, data, userId);
          }).catch(err => this.isError(resolve, mt, { err }));
        }
        this.reply(resolve, data);
      }).catch(err => this.isError(resolve, mt, { err }));
    });
  }
  /**
   * @swagger
   * /api/test/resendVerifyMail:
   *   post:
   *     tags:
   *     - Test API
   *     description: proess for Resend Email Verification page
   *     produces:
   *       - application/json
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/UserId'
   *     responses:
   *       200:
   *         description: 
   */
  resendVerifyMail(req, res) {
    const mt = MethodType.login;
    let query: any = this.getReq(req), { userId: email } = query;
    return new Promise(async (resolve, reject) => {
      const data: any = { status: Status.OK };
      let user = await this.queryUser(email), { userId, password, name } = user || {};
      if (!userId) {
        return this.reply(resolve, { status: Status.UserNotFound });
      }
      this.sendVerifyMail({ userId, password, name }, ret => {
        this.reply(resolve, data, userId);
      });
    });
  }
  /**
   * @swagger
   * /api/test/listUsers:
   *   post:
   *     tags:
   *     - Test API
   *     description: list users
   *     produces:
   *       - application/json
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/UserId'
   *     responses:
   *       200:
   *         description: 
   */
  listUsers(req, res) {
    const mt = MethodType.login;
    let query: any = this.getReq(req), { userId } = query;
    return new Promise(async (resolve, reject) => {
      let rc: any = await dbConn.updateUserSession(userId);
      if (rc?.rows?.affectedRows <= 0) {
        return this.reply(resolve, { status: Status.UserNotFound });
      }
      let ret = await dbConn.listUsers(), { rows: data = [] } = ret || {};
      this.reply(resolve, { datas: data, status: Status.OK });
    });
  }
  cacheId = 0;
  cacheVerifyMailInfo({ userId, password, name }) {
    let path, cacheId = Date.now(), data = { userId, password, name };
    cacheId = this.cacheId = Math.max(cacheId, this.cacheId + 1);
    // this.cached[cacheId] = { userId, password, name };
    this.setCacheData(RedisKeys.MailVerify, String(cacheId), data);
    // path = `/api/test/login?cacheId=${cacheId}`;
    return `?cacheId=${cacheId}`;
  }
  async getVerifyMailInfo(cacheId) {
    return await this.getCacheData(RedisKeys.MailVerify, String(cacheId));
  }
  /**
   * @swagger
   * /api/test/verifyMail:
   *   post:
   *     tags:
   *     - Test API 
   *     description: proess for user click verification mail link to verify user account
   *     produces:
   *       - application/json
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/Cache'
   *     responses:
   *       200:
   *         description: 
   */
  verifyMail(req, res) {
    const mt = MethodType.login;
    let query: any = this.getReq(req), { cacheId } = query;
    return new Promise(async (resolve, reject) => {
      let cached = await this.getVerifyMailInfo(cacheId) || {};
      let { userId, password, name } = cached || {};
      if (!userId) {
        const message = `verifyMail cacheId:${cacheId} not found`;
        console.error(message);
        this.reply(resolve, { message, status: -1 });
      } else {
        dbConn.updateUser({ userId, status: "a" }).then(ret => {
          const data: any = { status: Status.OK };
          // const path = `/api/test/login?cacheId=${cacheId}`;
          const path = `/test/#/login?cacheId=${cacheId}`;
          res.redirect(path);
          data.noSend = true;
          this.reply(resolve, data, userId);
        });
      }
    });

  }
  sendVerifyMail({ userId, password, name }, callback: Func) {
    // const name = "there";
    const cached = this.cacheVerifyMailInfo({ userId, password, name });
    const url = new URL(MethodType.verifyMail, getBaseUrl()).toString() + cached;
    // const url = path.join(getBaseUrl(), MethodType.verifyMail);
    const transporter = nodemailer.createTransport(SmtpConfig);
    const subject = `Welcome to SignUp Peter's Test`;
    // replace hardcoded options with data passed (somedata)
    const mailOptions = {
      from: 'test.peter.chang@gmail.com', // sender address
      to: userId, // list of receivers
      subject, // Subject line
      html: registerMailContent(name, userId, url),
      text: subject, //, // plaintext body
      //html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
    }
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error('error', error);
        callback({ error });
        return false;
      } else {
        console.log("Message sent:", info);
        callback({ info });
        return true;
      };
    });
  }
  logout(req, res) {
    let data = {};
    return data;
  }
  changeUserInfo(req, res) {
    let data = {};
    return data;
  }
  mailTo(req, res) {
    let data = {};
    return data;
  }
  // const Funs = {
  //   register, login, logout, changeUserInfo, mailTo
  // };
  toUrlPrefix(url) {
    let es = url.endsWith("/"), prefix = es ? url.substr(0, url.length - 1) : url;
    let s = es ? url : url + "/", regEx = new RegExp(`^${s.replace("/", "\\/")}*`);
    return { regEx, prefix };
  }
  getReq(req) {
    let { query = {}, body = {}, params = {} } = req || {}, rd = { ...query, ...body, ...params };
    return rd;
  }

  async listener({ name, regEx }, req, res) {
    let data, func = this[name];
    try {
      const json = o => o && JSON.stringify(o);
      let rd = this.getReq(req);
      if (typeof func != "function") {
        console.error(`${name} invalid`);
        return res.statusCode = 404;
      }
      data = await func.apply(this, [req, res]);
      console.log(`server[${name}] ${req.method} ${regEx} req:${json(rd)}, resp:`, data);
      if (data && data.noSend !== true) {
        res.send(data);
      }
    } catch (e) {
      console.error(`${req.method} ${regEx} error:`, e);
    }
    return data;
  }
  app;
  redisClient: Redis.Redis;
  initServer(app) {
    if (this.app === app) {
      return;
    }
    app.use(bodyParser.json());         // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
      extended: true
    }));
    Object.keys(Apis).forEach(name => {
      let { regEx } = this.toUrlPrefix(Apis[name])
      console.log(`use ${name}=>${Apis[name]}`);
      app.use(regEx, (req, res) => this.listener({ name, regEx }, req, res));
    });
    this.app = app;
    this.initRedis();
    this.initProcess()
    // this.initSwagger();
  }
  initSwagger() {
    const srcPath = "./server"
    const f = __filename, pd = path.parse(f);
    const cwd = process.cwd(), js = path.join(cwd, srcPath, `${pd.name}.ts`);
    const options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: `Peter Demo API's`,
          version: '1.0.0',
          description: "for Peter Test and Demo Library API"
        },
      },
      apis: [js], // files containing annotations as above
    };
    const swaggerPath = "/swagger";
    const specs = swaggerJsDoc(options), app = this.app;
    app.use(swaggerPath, swaggerUI.serve, swaggerUI.setup(specs));
    console.log(`initial Sqagger in ${swaggerPath}`);
  }
  initRedis() {
    this.redisClient = createRedisClient(redisConfig);
    // this.redisClient.connect();
  }
  setCacheData(redisKey: RedisKeys, field: string, data: object) {
    let key = RedisKeys[redisKey];
    let str = JSON.stringify(data);
    this.redisClient.hset(key, field, str);
  }
  async getCacheData(redisKey: RedisKeys, field: string) {
    try {
      let key = RedisKeys[redisKey];
      let str = await this.redisClient.hget(key, field);
      let data = JSON.parse(str);
      return data;
    } catch (e) {
      return null;
    }
  }
  loadListener: { [index: number]: RunOpts } = {};
  addListener(opts: RunOpts) {
    if (!opts || !opts.id || !opts.listener)
      return console.warn(`no id or listener`);
    this.loadListener[opts.id] = opts;
  }
  removeListener(id) {
    if (this.loadListener[id])
      delete this.loadListener[id];
  }
  initProcess() {
    process.on('uncaughtException', (err) => {
      log(`Caught exception:`, err);
    });
    process.on('unhandledRejection', (reason, p) => {
      log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    });
    process.on('message', (message) => {
      const { command, id, end = true } = message;
      let opts = this.loadListener[id], listener = opts && opts.listener;
      if (listener) {
        listener(message);
        end && this.removeListener(id);
      }
    });
  }
}

const _proxyServer = new ProxyServer();
export function proxyServer(app) {
  _proxyServer.initServer(app);
}

//module.exports = proxyServer;
// export default proxyServer;
