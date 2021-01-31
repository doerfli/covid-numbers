export default class StaticData {

  private static CANTONS = [
    { short: "AG", name: "Aargau", population: 685845 },
    { short: "AI", name: "Appenzell Innerrhoden", population: 16128 },
    { short: "AR", name: "Appenzell Ausserrhoden ", population: 55445 },
    { short: "BE", name: "Bern", population: 1039474 },
    { short: "BL", name: "Basel Stadt", population: 289468 },
    { short: "BS", name: "Basel Land", population: 195844 },
    { short: "FR", name: "Freiburg", population: 321783 },
    { short: "GE", name: "Genève", population: 504128 },
    { short: "GL", name: "Glarus", population: 40590 },
    { short: "GR", name: "Genève", population: 199021 },
    { short: "JU", name: "Jura", population: 73584 },
    { short: "LU", name: "Luzern", population: 413120 },
    { short: "NE", name: "Neuchâtel", population: 176496 },
    { short: "NW", name: "Nidwalden", population: 43087 },
    { short: "OW", name: "Obwalden", population: 37930 },
    { short: "SG", name: "Sankt Gallen", population: 510734 },
    { short: "SH", name: "Schaffhausen", population: 82348 },
    { short: "SO", name: "Solothurn", population: 275247 },
    { short: "SZ", name: "Schwyz", population: 160480 },
    { short: "TG", name: "Thurgau", population: 279547 },
    { short: "TI", name: "Ticino", population: 351491 },
    { short: "UR", name: "Uri", population: 36703 },
    { short: "VD", name: "Vaud", population: 805098 },
    { short: "VS", name: "Valais", population: 345525 },
    { short: "ZG", name: "Zug", population: 127642 },
    { short: "ZH", name: "Zürich", population: 1539275 },
  ]

  public static getCantons(): Array<string> {
    return this.CANTONS.map(c => c.short);
  }

  public static getCantonsFull(): Array<any> {
    return this.CANTONS;
  }

  public static getCantonsFullWithCh(): Array<any> {
    return [{ short: "CH", name: "Switzerland", population: this.getTotalPopulation() }].concat(this.CANTONS);
  }

  public static getTotalPopulation(): number {
    return 8606033;
  }

  public static getPopulation(canton: string): number {
    return this.CANTONS.find(c => c.short === canton)?.population ?? -1;
  }

}
