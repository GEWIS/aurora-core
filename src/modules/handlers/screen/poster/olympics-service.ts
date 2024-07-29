interface MedalTableRecord {
  countryName: string;
  gold: number;
  silver: number;
  bronze: number;
}

export default class OlympicsService {
  public async getMedalTable(): Promise<MedalTableRecord[]> {
    return [
      {
        countryName: 'United States',
        gold: 39,
        silver: 41,
        bronze: 33,
      },
      {
        countryName: 'China',
        gold: 38,
        silver: 32,
        bronze: 19,
      },
      {
        countryName: 'Japan',
        gold: 27,
        silver: 14,
        bronze: 17,
      },
      {
        countryName: 'Great Britain',
        gold: 22,
        silver: 20,
        bronze: 22,
      },
      {
        countryName: 'ROC',
        gold: 20,
        silver: 28,
        bronze: 23,
      },
      {
        countryName: 'Australia',
        gold: 17,
        silver: 7,
        bronze: 22,
      },
      {
        countryName: 'Netherlands',
        gold: 10,
        silver: 12,
        bronze: 14,
      },
      {
        countryName: 'France',
        gold: 10,
        silver: 12,
        bronze: 11,
      },
      {
        countryName: 'Germany',
        gold: 10,
        silver: 11,
        bronze: 16,
      },
      {
        countryName: 'Italy',
        gold: 10,
        silver: 10,
        bronze: 20,
      },
    ];
  }
}
