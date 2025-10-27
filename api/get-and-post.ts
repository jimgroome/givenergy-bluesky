import type { VercelRequest, VercelResponse } from "@vercel/node";
import { MeterDataResponse } from "./types";
import { postToBluesky } from "./bluesky";

const getGivenergyData = async (): Promise<MeterDataResponse> => {
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

  return response.json();
};

const getCalculatedData = (data: MeterDataResponse) => {
  const gridImport = data.data.today.grid.import;
  const gridExport = data.data.today.grid.export;

  const difference = Math.round(Number(gridExport - gridImport) * 100) / 100;

  return {
    gridImport,
    gridExport,
    difference,
  };
};

const getText = (data: MeterDataResponse) => {
  const { gridImport, gridExport, difference } = getCalculatedData(data);
  let text = `Today we imported ${gridImport}kWh and exported ${gridExport}kWh.`;
  if (difference > 0) {
    text += ` We exported ${difference}kWh more than we imported! ☀️`;
  }
  return text;
};

const handler = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const data = await getGivenergyData();

    const text = getText(data);

    await postToBluesky(text);

    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default handler;
