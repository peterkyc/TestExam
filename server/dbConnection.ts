

import * as MySQL from 'mysql';
import { MysqlError, PoolConnection } from "mysql";

import { SmtpConfig, DBConfig } from "../tsl/config";

export const rs = (...args) => args[args.length - 1];


/*
  login/register
  google
    userId: mail, name: user name, googleId, type = "GO", tokenObj  
  email
    userId: mail, password, (repassword)


 */
export interface QueryResult {
  err?: MysqlError;
  rows?: any[];

  fields?: any[];
}

export interface DBSetting extends MySQL.ConnectionConfig {
  host?: string;
  user?: string;
  password?: string;
  database?: string;
  onConnected?: (conn: MySQL.Connection, err: MySQL.MysqlError, ...args: any[]) => void;
}

function sqlResule(resolve, err, rows = [], fields = []) {
  if (err) {
    resolve({ err });
    console.error(`query account error:${err}`, err);
  } else {
    resolve({ rows, fields });
    console.log(`rows:${rows.length}, fields:`, fields);
  }
}

export class DBConn {
  //private connection: MySQL.Connection;
  pool: MySQL.Pool;
  tested = false;
  _err: MySQL.MysqlError;
  _connected: boolean;
  constructor(private setting: DBSetting) {
    const error = (name, err) => console.error(`MySQL Pool ${name}:${err && err.message}`, err);
    const proceError = (pool, name) => pool.on(name, err => error(name, err));
    let pool = this.pool = MySQL.createPool({ ...setting, connectionLimit: 100 });
    //'' | '' | 'release',
    console.log(`MySQL createPool from:${setting.host}/${setting.database}`);
    proceError(pool, "end");
    proceError(pool, "error");
    pool.on("connection", conn => {
      this.onConnection(conn)
      if (this.tested) {
        return;
      }
      this.tested = true;
      this.pool.query(`select * from account `, (err, rows = [], fields = []) => {
        if (err)
          return console.error(`query account error:${err}`, err);
        console.log(`initial query rows:${rows.length}`);
      });
      console.log(`MySQL Pool ${this.setting.database} Connected !!`);
    });
    this.init();
  }
  listeners = {};
  addListener(ev: 'connection' | 'acquire' | 'release', callback: (connection: PoolConnection) => void): any;
  addListener(ev: 'error', callback: (err: MysqlError) => void);
  addListener(ev: string, callback: (...args) => any) {
    this.listeners[ev] = callback;
  }
  // query(options: string | MySQL.QueryOptions, callback?: MySQL.queryCallback): Query;
  // query(options: string | MySQL.QueryOptions, values?: any, callback?: MySQL.queryCallback): MySQL.Query {
  //   // if (typeof values == "function")
  //   //   return this.pool.query(options, values).on("error", callback);
  //   return this.pool.query(options, values, callback).on("error", callback);
  // }
  onConnection(conn: PoolConnection) {
    let c = this.listeners["connection"];
    if (typeof c == "function") {
      c.apply(this, [conn]);
    }
    this._connected = true;
  }
  init() {
    // 取得連線池的連線
    this.pool.getConnection((err, connection) => {
      if (err) {
        console.error(`MySQL Pool error:${err && err.message}`, err)
      }
    });
  }
  isConnected() {
    return this._connected && this._err == null;
  }
  loginCount(userId): Promise<QueryResult> {
    const sql = `update account set last_login_at = now(), login_count = login_count+1 where userId = ?`;
    return new Promise((resolve, reject) => {
      this.pool.query(sql, [userId], (err, rows, fields) => sqlResule(resolve, err, rows, fields));
    });
  }
  updateUserSession(userId): Promise<QueryResult> {
    const sql = `update account set updated_at = now() where userId = ?`;
    return new Promise((resolve, reject) => {
      this.pool.query(sql, [userId], (err, rows, fields) => sqlResule(resolve, err, rows, fields));
    });
  }
  queryUser(userId): Promise<QueryResult> {
    const sql = `SELECT userId, userName name, password, type, status from account where userId = ?`;
    return new Promise((resolve, reject) => {
      this.pool.query(sql, [userId], (err, rows, fields) => sqlResule(resolve, err, rows, fields));
    });
  }
  querySQL(table, fields) {
    let flds = fields.map(f => f instanceof Array ? f.join(" ") : f).join(", ");
    return `select ${flds} from ${table}`;
  }
  listUsers(): Promise<QueryResult> {
    const fields = [
      "userId",
      ["userName", "name"],
      "type",
      "status",
      ["last_login_at", "lastLoginAt"],
      ["login_count", "loginCount"],
      ["created_at", "createdAt"],
      ["updated_at", "lastSessionAt"],
    ];
    const sql = this.querySQL("account", fields);
    return new Promise((resolve, reject) => {
      this.pool.query(sql, (err, rows, fields) => sqlResule(resolve, err, rows, fields));
    });
  }
  insertUser({ userId, name, password, googleId, type, tokenObj }): Promise<QueryResult> {
    const sql = `insert into account set ?`, created_at = new Date();
    const param = { userId, userName: name, password, type, created_at };
    return new Promise((resolve, reject) => {
      this.pool.query(sql, param, (err, rows, fields) => sqlResule(resolve, err, rows, fields));
    });
  }

  updateUser(data: { userId, name?, password?, status?}) {
    const { name, password, status } = data, update = { userName: name, password, status };
    const sql = `update account set ? WHERE userId = '${data.userId}'`;
    const param = Object.keys(update).reduce((m, n) => rs(update[n] && (m[n] = update[n]), m), {});
    return new Promise((resolve, reject) => {
      this.pool.query(sql, param, (err, rows, fields) => sqlResule(resolve, err, rows, fields));
    });

  }

}
const getDBC = () => new DBConn(DBConfig);
export const dbConn = getDBC();

// export {
//   queryUser, registerUser, updateUser, isConnected,
//   SmtpConfig, DBConfig, dbConn,
// };

