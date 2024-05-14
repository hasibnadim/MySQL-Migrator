process.env.rootDir = process.cwd() //+ "/disttest";

import { ParamParser } from "./lib/ParamParser";
import {
  buildSql,
  downMigration,
  init,
  makeMigration,
  showUsage,
  upMigration,
} from "./lib/primaryCMD";

const version = "v1.0.0";
const params = new ParamParser();
switch (params.getPrimaryCmd()) {
  case "init":
    init();
    break;
  case "make":
    makeMigration(params.getVersionValue());
    break;
  case "up":
    upMigration(params);
    break;
  case "down":
    downMigration(params);
    break;
  
  case "build":
    buildSql(params);
    break;
  
  case "-v":
  case "--version":
    console.log(version);

    break;
  case "-h":
  case "--help":
  default:
    showUsage();
    break;
}
