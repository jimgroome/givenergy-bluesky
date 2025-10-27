export interface MeterDataResponse {
  data: {
    time: string;
    today: {
      solar: number;
      grid: {
        import: number;
        export: number;
      };
      battery: {
        charge: number;
        discharge: number;
      };
      consumption: number;
      ac_charge: number;
    };
    total: {
      solar: number;
      grid: {
        import: number;
        export: number;
      };
      battery: {
        charge: number;
        discharge: number;
      };
      consumption: number;
      ac_charge: number;
    };
    is_metered: boolean;
  };
}
