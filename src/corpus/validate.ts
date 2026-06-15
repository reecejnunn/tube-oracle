import type {
  Station,
  StationLine,
  StationDetail,
  StationDetails,
  OriginalName,
  Line,
  LineDetail,
  LineDetails,
} from "./types.js";

function parseStationLine(raw: unknown): StationLine {
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

function parseStation(raw: unknown): Station {
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

  const id = obj.id;

  return {
    id: id,
    name: obj.name,
    date: obj.date,
    closedDate: obj.closedDate,
    lines: obj.lines.map((line, i) => {
      try {
        return parseStationLine(line);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        throw new Error(`Station "${id}" lines[${i}]: ${errorMessage}`, {
          cause: error,
        });
      }
    }),
    ...(obj.originalName !== undefined && { originalName: obj.originalName }),
  };
}

export function parseStations(raw: unknown): Station[] {
  if (!Array.isArray(raw)) throw new Error("Invalid station data");

  return raw.map(parseStation);
}

function parseOriginalName(raw: unknown): OriginalName {
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

function parseStationDetail(raw: unknown): StationDetail {
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

function parseLine(raw: unknown): Line {
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

function parseLineDetail(raw: unknown): LineDetail {
  if (typeof raw !== "object" || raw === null)
    throw new Error("Invalid line detail data");

  const obj = raw as Record<string, unknown>;

  if (typeof obj.history !== "string") throw new Error("Invalid line history");
  if (
    !Array.isArray(obj.funFacts) ||
    !obj.funFacts.every((f) => typeof f === "string")
  )
    throw new Error("Invalid line fun facts");
  if (
    obj.keyEngineers !== undefined &&
    (!Array.isArray(obj.keyEngineers) ||
      !obj.keyEngineers.every((e) => typeof e === "string"))
  )
    throw new Error("Invalid line key engineers");
  if (obj.originalNames !== undefined && !Array.isArray(obj.originalNames))
    throw new Error("Invalid line original names");

  return {
    history: obj.history,
    funFacts: obj.funFacts,
    ...(obj.keyEngineers !== undefined && { keyEngineers: obj.keyEngineers }),
    ...(obj.originalNames !== undefined && {
      originalNames: obj.originalNames.map(parseOriginalName),
    }),
  };
}

export function parseLineDetails(raw: unknown): LineDetails {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw))
    throw new Error("Invalid line details data");

  const obj = raw as Record<string, unknown>;
  const details: LineDetails = {};

  for (const [key, value] of Object.entries(obj)) {
    details[key] = parseLineDetail(value);
  }

  return details;
}
