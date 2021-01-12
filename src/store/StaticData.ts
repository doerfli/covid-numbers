export default class StaticData {

  private static CANTONS = [
    { name: "AG" },
    { name: "AI" },
    { name: "AR" },
    { name: "BE" },
    { name: "BL" },
    { name: "BS" },
    { name: "FR" },
    { name: "GE" },
    { name: "GL" },
    { name: "GR" },
    { name: "JU" },
    { name: "LU" },
    { name: "NE" },
    { name: "NW" },
    { name: "OW" },
    { name: "SG" },
    { name: "SH" },
    { name: "SO" },
    { name: "SZ" },
    { name: "TG" },
    { name: "TI" },
    { name: "UR" },
    { name: "VD" },
    { name: "VS" },
    { name: "ZG" },
    { name: "ZH" },
  ]

  public static getCantons(): Array<string> {
    return this.CANTONS.map(c => c.name);
  }

}
