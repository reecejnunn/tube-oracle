console.log("hello tube-oracle");

type Route = "semantic" | "structured" | "hybrid";
type Source = { stationId: string; stationName: string; lineId: string };

type AskRequest = {
  question: string;
};

type AskResponse = {
  answer: string;
  sources: Source[];
  route: Route;
  tokensUsed: number;
};

type Station = {
  id: string;
  name: string;
  date: string;
  closedDate: string | null;
  lines: StationLine[];
  originalName?: string;
};

type StationLine = {
  line: string;
  validFrom: number;
  validTo?: number;
};

export function ask(_request: AskRequest): AskResponse {
  return {
    answer: "Not yet implemented",
    sources: [],
    route: "semantic",
    tokensUsed: 0,
  };
}

export function parseStationLine(raw: unknown): StationLine {
  if (typeof raw !== "object" || raw === null)
    throw new Error("Invalid station line data");

  const obj = raw as Record<string, unknown>;

  if (typeof obj.line !== "string") throw new Error("Invalid line data");
  if (typeof obj.validFrom !== "number")
    throw new Error(`Invalid validFrom: got ${typeof obj.validFrom}`);
  if (obj.validTo !== undefined && typeof obj.validTo !== "number")
    throw new Error(`Invalid validTo: got ${typeof obj.validTo}`);

  return {
    line: obj.line,
    validFrom: obj.validFrom,
    ...(obj.validTo !== undefined && { validTo: obj.validTo }),
  };
}

export function parseStation(raw: unknown): Station {
  if (typeof raw !== "object" || raw === null)
    throw new Error("Invalid station data");

  const obj = raw as Record<string, unknown>;

  if (typeof obj.id !== "string") throw new Error("Invalid station id");
  if (typeof obj.name !== "string") throw new Error("Invalid station name");
  if (typeof obj.date !== "string") throw new Error("Invalid station date");
  if (obj.closedDate !== null && typeof obj.closedDate !== "string")
    throw new Error("Invalid station closedDate");
  if (!Array.isArray(obj.lines)) throw new Error("Invalid station lines");
  if (obj.originalName !== undefined && typeof obj.originalName !== "string")
    throw new Error("Invalid station originalName");

  return {
    id: obj.id,
    name: obj.name,
    date: obj.date,
    closedDate: obj.closedDate,
    lines: obj.lines.map(parseStationLine),
    ...(obj.originalName !== undefined && { originalName: obj.originalName }),
  };
}
