console.log("hello tube-oracle");

import { readFileSync } from "node:fs";
import {
  parseLineDetails,
  parseLines,
  parseStationDetails,
  parseStations,
} from "./corpus/validate.js";

loadCorpus();

export type Route = "semantic" | "structured" | "hybrid";
export type Source = { stationId: string; stationName: string; lineId: string };

export type AskRequest = {
  question: string;
};

export type AskResponse = {
  answer: string;
  sources: Source[];
  route: Route;
  tokensUsed: number;
};

export function ask(_request: AskRequest): AskResponse {
  return {
    answer: "Not yet implemented",
    sources: [],
    route: "semantic",
    tokensUsed: 0,
  };
}

function loadJson(relativePath: string): unknown {
  const text = readFileSync(new URL(relativePath, import.meta.url), "utf-8");
  const parsed: unknown = JSON.parse(text); // pin to unknown to avoid TS inferring any type
  return parsed;
}

export function loadCorpus() {
  const stations = parseStations(loadJson("../data/stations-core.json"));
  const stationDetails = parseStationDetails(
    loadJson("../data/station-details.json"),
  );
  const lines = parseLines(loadJson("../data/lines-core.json"));
  const lineDetails = parseLineDetails(loadJson("../data/line-details.json"));

  console.log(
    `Loaded corpus: ${stations.length} stations, ` +
      `${Object.keys(stationDetails).length} station details, ` +
      `${lines.length} lines, ` +
      `${Object.keys(lineDetails).length} line details`,
  );

  return { stations, stationDetails, lines, lineDetails };
}
