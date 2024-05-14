export class ParamParser {
  private agrs = process.argv;

  public getPrimaryCmd() {
    return this.agrs[2];
  }
  public getVersionValue(): string | undefined {
    let index =
      this.agrs.findIndex((v) => v === "-v") ||
      this.agrs.findIndex((v) => v === "--version");
    if (index == -1 || !this.agrs[index + 1]) {
      return undefined;
    }
    return this.agrs[index + 1];
  }
  public getUpModifier(): Record<"table" | "func" | "proc" | "tgr", boolean> {
    let tmp: Record<"table" | "func" | "proc" | "tgr", boolean> = {
      func: true,
      proc: true,
      table: true,
      tgr: true,
    };
    let x = this.agrs
      .find((v) => v.startsWith("--"))
      ?.slice(2)
      .split("");
    if (x) {
      tmp = {
        table: x.includes("t"),
        func: x.includes("f"),
        proc: x.includes("p"),
        tgr: x.includes("g"),
      };
    }

    return tmp;
  }
}
