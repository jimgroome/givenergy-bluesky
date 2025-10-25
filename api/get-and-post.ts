import type { VercelRequest, VercelResponse } from "@vercel/node";
import { BskyAgent } from "@atproto/api";

interface MeterDataResponse {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/inverter/${process.env.INVERTER_ID}/meter-data/latest`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.GIVENERGY_API_KEY || ""}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data: MeterDataResponse = await response.json();

    const gridImport = data.data.today.grid.import;
    const gridExport = data.data.today.grid.export;

    const difference = Math.round(Number(gridImport - gridExport) * 100) / 100;

    let text = `Today we imported ${gridImport}kWh and exported ${gridExport}kWh.`;
    if (gridImport <= gridExport) {
      text += ` We exported ${Math.abs(
        difference
      )}kWh more than we imported! ☀️`;
    }

    const agent = new BskyAgent({
      service: process.env.BLUESKY_URL || "",
    });
    await agent.login({
      identifier: process.env.BLUESKY_USERNAME || "",
      password: process.env.BLUESKY_PASSWORD || "",
    });

    await agent.post({
      text,
    });

    await agent.logout();

    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
