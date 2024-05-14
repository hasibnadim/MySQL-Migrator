import { EnvParser } from "./EnvParser";
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { writeFile } from "fs/promises";
import { ParamParser } from "./ParamParser";
import { green, magenta, red } from "./common";
import { ShowUsage } from "./ShowUsage";
import { SqlMaster } from "./SqlMaster";
import { QueryMaster } from "./QueryMaster";
import sqlMinify from "pg-minify";
export function showUsage() {
  ShowUsage.showAll();
}

export function init() {
  let migrationDir = process.env.rootDir! + "/.migration";
  if (!existsSync(migrationDir)) {
    // create .env file
    const envOvj = new EnvParser();
    envOvj.writeFile();
    // create .migration folder
    mkdirSync(migrationDir);
    mkdirSync(process.env.rootDir! + "/db");

    writeFileSync(process.env.rootDir! + "/db/base.sql", "-- initialized");
    console.log(green("Initialized successfull."));
  } else {
    console.log(red("Already Initialized"));
  }
}

export async function makeMigration(version?: string) {
  if (!version) {
    console.log(red("No version found."));
    ShowUsage.showMake();
    process.exit(1);
  }

  let vDir = process.env.rootDir! + "/db" + "/v" + version;

  if (!existsSync(vDir)) {
    mkdirSync(vDir, { recursive: true });

    let files = [
      "table.sql",
      "function.sql",
      "procedure.sql",
      "trigger.sql",
      "down.sql",
    ];
    let wp: Promise<void>[] = [];
    files.forEach((f: string) => {
      wp.push(writeFile(vDir + "/" + f, ""));
    });
    await Promise.all(wp);
  } else {
    console.log(red(`Already exist: v${version}`));
  }
}

export async function upMigration(pp: ParamParser) {
  let connection = new QueryMaster();
  let sqlm = new SqlMaster(pp.getVersionValue());

  connection.connect(); 
  console.log(magenta("base.sql : "), await connection.run(sqlMinify(sqlm.getBaseSql())));

  let upm = pp.getUpModifier();
  let sqdta: IteratorResult<
    {
      sql: string;
      version: string;
    },
    any
  > | null = null;
  if (upm.table) {
    console.log(green("------Table Start-------"));
    // table
    let tables = sqlm.getTable();
    sqdta = tables.next();

    while (!sqdta.done) {
      console.log(
        magenta(`${sqdta.value.version}| table.sql: `),
        await connection.run(sqlMinify(sqdta.value.sql))
      );
      sqdta = tables.next();
    }

    console.log(green("------Table Complate-------"));
  }

  if (upm.func) {
    console.log(green("------Function Start-------"));
    // function
    let fnsql = sqlm.getFunction();
    sqdta = fnsql.next();

    while (!sqdta.done) {
      console.log(
        magenta(`${sqdta.value.version}| function.sql: `),
        await connection.run(sqlMinify(sqdta.value.sql))
      );
      sqdta = fnsql.next();
    }
    console.log(green("------Function Complate-------"));
  }

  if (upm.proc) {
    console.log(green("------Stored Procedure Start-------"));

    // procedure
    let proc = sqlm.getSProcedure();
    sqdta = proc.next();

    while (!sqdta.done) {
      console.log(
        magenta(`${sqdta.value.version}| procedure.sql: `),
        await connection.run(sqlMinify(sqdta.value.sql))
      );
      sqdta = proc.next();
    }

    console.log(green("------Stored Procedure Complate-------"));
  }

  if (upm.tgr) {
    console.log(green("------Trigger Start-------"));

    // trigger
    let trigger = sqlm.getTrigger();
    sqdta = trigger.next();

    while (!sqdta.done) {
      console.log(
        magenta(`${sqdta.value.version}| trigger.sql: `),
        await connection.run(sqlMinify(sqdta.value.sql))
      );
      sqdta = trigger.next();
    }
    console.log(green("------Trigger Complate-------"));
  }
  connection.end();
  console.log(green("------Migration Successfull-------"));
}

export async function downMigration(pp: ParamParser) {
  let connection = new QueryMaster();
  let sqlm = new SqlMaster(pp.getVersionValue(), true);

  connection.connect();
  let down = sqlm.getDown();
  let sqdta = down.next();

  while (!sqdta.done) {
    console.log(
      magenta(`${sqdta.value.version}| down.sql: `),
      await connection.run(sqlMinify(sqdta.value.sql))
    );
    sqdta = down.next();
  }

  connection.end();
  console.log(green("------Migration Down Successfull-------"));
}

export function buildSql(pp: ParamParser) {
  let sqlm = new SqlMaster(pp.getVersionValue());
  if (!existsSync(EnvParser.path.distDir)) {
    mkdirSync(EnvParser.path.distDir);
  }
  let bs = createWriteStream(`${EnvParser.path.distDir}/prod.sql`);
  bs.write(sqlMinify(sqlm.getBaseSql()) + ";\n");

  let sqdta: IteratorResult<
    {
      sql: string;
      version: string;
    },
    any
  > | null = null;
  let tmp: string = "";
  let file = sqlm.getTable();
  sqdta = file.next();
  while (!sqdta.done) {
    tmp = sqlMinify(sqdta.value.sql);
    if (tmp) bs.write(tmp + ";\n");
    sqdta = file.next();
  }

  file = sqlm.getFunction();
  sqdta = file.next();
  while (!sqdta.done) {
    tmp = sqlMinify(sqdta.value.sql);
    if (tmp) bs.write(tmp + ";\n");
    sqdta = file.next();
  }

  file = sqlm.getSProcedure();
  sqdta = file.next();
  while (!sqdta.done) {
    tmp = sqlMinify(sqdta.value.sql);
    if (tmp) bs.write(tmp + ";\n");
    sqdta = file.next();
  }
  file = sqlm.getTrigger();
  sqdta = file.next();
  while (!sqdta.done) {
    tmp = sqlMinify(sqdta.value.sql);
    if (tmp) bs.write(tmp + ";\n");
    sqdta = file.next();
  }
  bs.close();
}
