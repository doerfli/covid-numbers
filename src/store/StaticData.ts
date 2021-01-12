export default class StaticData {

  private static CANTONS = [
    { name: "AG", population: 685845 },
    { name: "AI", population: 16128 },
    { name: "AR", population: 55445 },
    { name: "BE", population: 1039474 },
    { name: "BL", population: 289468 },
    { name: "BS", population: 195844 },
    { name: "FR", population: 321783 },
    { name: "GE", population: 504128 },
    { name: "GL", population: 40590 },
    { name: "GR", population: 199021 },
    { name: "JU", population: 73584 },
    { name: "LU", population: 413120 },
    { name: "NE", population: 176496 },
    { name: "NW", population: 43087 },
    { name: "OW", population: 37930 },
    { name: "SG", population: 510734 },
    { name: "SH", population: 82348 },
    { name: "SO", population: 275247 },
    { name: "SZ", population: 160480 },
    { name: "TG", population: 279547 },
    { name: "TI", population: 351491 },
    { name: "UR", population: 36703 },
    { name: "VD", population: 805098 },
    { name: "VS", population: 345525 },
    { name: "ZG", population: 127642 },
    { name: "ZH", population: 1539275 },
  ]

  public static getCantons(): Array<string> {
    return this.CANTONS.map(c => c.name);
  }

  public static getTotalPopulation(): number {
    return 8606033;
  }

}
