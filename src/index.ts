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

type StationDetail = {
  zone: number;
  history: string;
  architect?: string;
  funFacts?: string[];
  grade?: string;
  originalNames?: OriginalName[];
};

type StationDetails = {
  [stationId: string]: StationDetail;
};

type OriginalName = {
  name: string;
  years: string;
};

type Line = {
  id: string;
  name: string;
  shortName: string;
  stations: string[];
  establishedDate: string;
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

export function parseOriginalName(raw: unknown): OriginalName {
  if (typeof raw !== "object" || raw === null)
    throw new Error("Invalid original name data");

  const obj = raw as Record<string, unknown>;

  if (typeof obj.name !== "string") throw new Error("Invalid original name");
  if (typeof obj.years !== "string")
    throw new Error("Invalid original name years");

  return {
    name: obj.name,
    years: obj.years,
  };
}

export function parseStationDetail(raw: unknown): StationDetail {
  if (typeof raw !== "object" || raw === null)
    throw new Error("Invalid station detail data");

  const obj = raw as Record<string, unknown>;

  if (typeof obj.zone !== "number") throw new Error("Invalid station zone");
  if (typeof obj.history !== "string")
    throw new Error("Invalid station history");
  if (obj.architect !== undefined && typeof obj.architect !== "string")
    throw new Error("Invalid station architect");
  if (
    obj.funFacts !== undefined &&
    (!Array.isArray(obj.funFacts) ||
      !obj.funFacts.every((f) => typeof f === "string"))
  )
    throw new Error("Invalid station fun facts");
  if (obj.grade !== undefined && typeof obj.grade !== "string")
    throw new Error("Invalid station grade");
  if (obj.originalNames !== undefined && !Array.isArray(obj.originalNames))
    throw new Error("Invalid station original names");

  return {
    zone: obj.zone,
    history: obj.history,
    ...(obj.architect !== undefined && { architect: obj.architect }),
    ...(obj.funFacts !== undefined && { funFacts: obj.funFacts }),
    ...(obj.grade !== undefined && { grade: obj.grade }),
    ...(obj.originalNames !== undefined && {
      originalNames: obj.originalNames.map(parseOriginalName),
    }),
  };
}

export function parseStationDetails(raw: unknown): StationDetails {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw))
    throw new Error("Invalid station details data");

  const obj = raw as Record<string, unknown>;
  const details: StationDetails = {};

  for (const [key, value] of Object.entries(obj)) {
    details[key] = parseStationDetail(value);
  }

  return details;
}

export function parseLine(raw: unknown): Line {
  if (typeof raw !== "object" || raw === null)
    throw new Error("Invalid line data");

  const obj = raw as Record<string, unknown>;

  if (typeof obj.id !== "string") throw new Error("Invalid line id");
  if (typeof obj.name !== "string") throw new Error("Invalid line name");
  if (typeof obj.shortName !== "string")
    throw new Error("Invalid line shortName");
  if (
    !Array.isArray(obj.stations) ||
    !obj.stations.every((s) => typeof s === "string")
  )
    throw new Error("Invalid line stations");
  if (typeof obj.establishedDate !== "string")
    throw new Error("Invalid line establishedDate");

  return {
    id: obj.id,
    name: obj.name,
    shortName: obj.shortName,
    stations: obj.stations,
    establishedDate: obj.establishedDate,
  };
}

export function parseLines(raw: unknown): Line[] {
  if (!Array.isArray(raw)) throw new Error("Invalid line data");

  return raw.map(parseLine);
}
