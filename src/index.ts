console.log("hello tube-oracle");

import { loadJson } from "./corpus/io.js";
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

export function loadCorpus() {
  const stations = parseStations(loadJson("stations-core.json"));
  const stationDetails = parseStationDetails(loadJson("station-details.json"));
  const lines = parseLines(loadJson("lines-core.json"));
  const lineDetails = parseLineDetails(loadJson("line-details.json"));

  console.log(
    `Loaded corpus: ${stations.length} stations, ` +
      `${Object.keys(stationDetails).length} station details, ` +
      `${lines.length} lines, ` +
      `${Object.keys(lineDetails).length} line details`,
  );

  return { stations, stationDetails, lines, lineDetails };
}
