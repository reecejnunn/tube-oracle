console.log("hello tube-oracle");

import { loadCorpus } from "./corpus/load.js";

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
