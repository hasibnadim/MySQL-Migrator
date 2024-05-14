import { green } from "./common";

export class ShowUsage {
  public static showInit() {
    console.log(`${green(" migrator init")}\t\t// To init project`);
  }
  public static showMake() {
    console.log(
      `${green(" migrator make -v <version>")}\t// To make new migration`
    );
  }
  public static showUp() {
    console.log(
      `${green(
        " migrator up [-v <version> --tfpg]"
      )}\t// To run up migration start to this version`
    );
  }
  public static showDown() {
    console.log(
      `${green(
        " migrator down -v <version>"
      )}\t// To run down migration last to this version`
    );
  }
 
  public static showNewTest() {
    console.log(
      `${green(" migrator test -new <name>")}\t// To make new test file`
    );
  }

  public static showRunTest() {
    console.log(
      `${green(
        " migrator test [-exec <name>]"
      )}\t// To run test, all or target`
    );
  }
  public static showBuild() {
    console.log(
      `${green(" migrator build")}\t\t// T build sql for production`
    );
  }

  public static showAll() {
    ShowUsage.showInit();
    ShowUsage.showMake();
    ShowUsage.showUp();
    ShowUsage.showDown(); 
    // ShowUsage.showNewTest();
    // ShowUsage.showRunTest();
    ShowUsage.showBuild();
  }
}
