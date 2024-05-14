import mysql from "mysql";
import { EnvParser } from "./EnvParser";
import { green, red } from "./common";
export class QueryMaster {
  private mysqlConn: mysql.Connection | null = null;
  private env: EnvParser = new EnvParser();
  constructor() {
    this.env.parse();
    if (this.env.isMysql()) {
      this.mysqlConn = mysql.createConnection({
        host: this.env.DB_Var.DB_HOST,
        user: this.env.DB_Var.DB_USER,
        password: this.env.DB_Var.DB_PASS,
        database: this.env.DB_Var.DB_NAME,
        bigNumberStrings: true,
        multipleStatements: true,
      });
    } else if (this.env.isMsSql()) {
    } else {
      console.log(red("Invalid Database Type"));
      process.exit(1);
    }
  }
  connect() {
    if (this.mysqlConn) {
      this.mysqlConn.connect();
    }
  }
  end() {
    if (this.mysqlConn) {
      this.mysqlConn.end();
    }
  }
  run(sql: string): Promise<string> {
    return new Promise((resolve,reject) => {
      if (!sql) return resolve(green("Empty"));
      if (this.mysqlConn) {
        this.mysqlConn.query(sql, (err) => {
          if (err) {
            
            reject(red(err.sqlMessage || err.message));
          } else {
            resolve("✅");
          }
        });
      }
    });
  }
}
