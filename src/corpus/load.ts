import { loadJson } from "./io.js";
import {
  parseLineDetails,
  parseLines,
  parseStationDetails,
  parseStations,
} from "./validate.js";

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
