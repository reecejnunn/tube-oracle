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

export function ask(_request: AskRequest): AskResponse {
  return {
    answer: "Not yet implemented",
    sources: [],
    route: "semantic",
    tokensUsed: 0,
  };
}
