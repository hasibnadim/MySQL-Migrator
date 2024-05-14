import { readFileSync, readdirSync } from "fs";
import { EnvParser } from "./EnvParser";

export class SqlMaster {
  targetMigraions: string[] = [];
  tableSql = "";
  path = EnvParser.path;
  constructor(private version?: string,private isDown?:boolean) {
    this.targetMigraions = readdirSync(EnvParser.path.dbDir).splice(1);
    if (this.isDown) {
      this.targetMigraions = this.targetMigraions.reverse();
    }

    if (this.version) {
      this.targetMigraions = this.targetMigraions.slice(
        0,
        this.targetMigraions.findIndex((v) => v === `v${this.version}`) + 1
      );
    }
  }

  getBaseSql() {
    return readFileSync(this.path.baseSql).toString();
  }
  *getTable(): Generator<{ sql: string; version: string }> {
    for (let index = 0; index < this.targetMigraions.length; index++) {
      yield {
        sql: readFileSync(
          EnvParser.path.tblSqlDir(this.targetMigraions[index].slice(1))
        ).toString(),
        version: this.targetMigraions[index],
      };
    }
  }

  *getFunction(): Generator<{ sql: string; version: string }> {
    for (let index = 0; index < this.targetMigraions.length; index++) {
      yield {
        sql: readFileSync(
          EnvParser.path.fnSqlDir(this.targetMigraions[index].slice(1))
        ).toString(),
        version: this.targetMigraions[index],
      };
    }
  }
  *getSProcedure(): Generator<{ sql: string; version: string }> {
    for (let index = 0; index < this.targetMigraions.length; index++) {
      yield {
        sql: readFileSync(
          EnvParser.path.procSqlDir(this.targetMigraions[index].slice(1))
        ).toString(),
        version: this.targetMigraions[index],
      };
    }
  }
  *getTrigger(): Generator<{ sql: string; version: string }> {
    for (let index = 0; index < this.targetMigraions.length; index++) {
      yield {
        sql: readFileSync(
          EnvParser.path.tggrSqlDir(this.targetMigraions[index].slice(1))
        ).toString(),
        version: this.targetMigraions[index],
      };
    }
  }

  *getDown(): Generator<{ sql: string; version: string }> {
    for (let index = 0; index < this.targetMigraions.length; index++) {
      yield {
        sql: readFileSync(
          EnvParser.path.downSqlDir(this.targetMigraions[index].slice(1))
        ).toString(),
        version: this.targetMigraions[index],
      };
    }
  }
}
