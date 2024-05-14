import fs from "fs";
export class EnvParser {
  private static rootdir = process.env.rootDir || ".";
  public static path = {
    dotMigrationDir: `${this.rootdir}/.migration`,
    mmgDir: `${this.rootdir}/.migration/mmg.sql`,
    dbDir: `${this.rootdir}/db`,
    distDir:`${this.rootdir}/dist`,
    mVersionDir: (v: string) => `${this.rootdir}/db/v${v}`,
    downSqlDir: (v: string) => `${this.rootdir}/db/v${v}/down.sql`,
    fnSqlDir: (v: string) => `${this.rootdir}/db/v${v}/function.sql`,
    procSqlDir: (v: string) => `${this.rootdir}/db/v${v}/procedure.sql`,
    tblSqlDir: (v: string) => `${this.rootdir}/db/v${v}/table.sql`,
    tggrSqlDir: (v: string) => `${this.rootdir}/db/v${v}/trigger.sql`,
    baseSql: `${this.rootdir}/db/base.sql`,
  };
  private db_type = ["mysql", "sqlserver"];
  public DB_Var = {
    DB_TYPE: this.db_type[0],
    DB_HOST: "localhost",
    DB_NAME: "mydb",
    DB_USER: "root",
    DB_PASS: "",
  };
  constructor() {
    require("dotenv").config({ path: process.env.rootDir + "/.env" });
  }
  parse() {
    if (
      process.env.DB_TYPE !== undefined &&
      process.env.DB_USER !== undefined &&
      process.env.DB_NAME !== undefined &&
      process.env.DB_HOST !== undefined &&
      process.env.DB_PASS !== undefined
    ) {
      this.DB_Var.DB_TYPE = process.env.DB_TYPE;
      this.DB_Var.DB_USER = process.env.DB_USER;
      this.DB_Var.DB_PASS = process.env.DB_PASS;
      this.DB_Var.DB_NAME = process.env.DB_NAME;
      this.DB_Var.DB_HOST = process.env.DB_HOST;
    } else {
      throw Error("Invalid Database info at enviorment variable");
    }
  }
  writeFile() {
    type TT = keyof typeof this.DB_Var;
    let str = (Object.keys(this.DB_Var) as Array<TT>)
      .map((v) => `${v}=${this.DB_Var[v] as any}`)
      .join("\n");
    let projDir = process.env.rootDir || "./";

    if (!fs.existsSync(projDir) || !fs.lstatSync(projDir).isDirectory()) {
      fs.mkdirSync(projDir, { recursive: true });
    }

    fs.writeFileSync(projDir + "/.env", str);
  }
  isMysql() {
    return this.DB_Var.DB_TYPE === this.db_type[0];
  }
  isMsSql() {
    return this.DB_Var.DB_TYPE === this.db_type[1];
  }
}
