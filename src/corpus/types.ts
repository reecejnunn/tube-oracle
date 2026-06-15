export type Station = {
  id: string;
  name: string;
  date: string;
  closedDate: string | null;
  lines: StationLine[];
  originalName?: string;
};

export type StationLine = {
  line: string;
  validFrom: number;
  validTo?: number;
};

export type StationDetail = {
  zone: number;
  history: string;
  architect?: string;
  funFacts?: string[];
  grade?: string;
  originalNames?: OriginalName[];
};

export type StationDetails = {
  [stationId: string]: StationDetail;
};

export type OriginalName = {
  name: string;
  years: string;
};

export type Line = {
  id: string;
  name: string;
  shortName: string;
  stations: string[];
  establishedDate: string;
};

export type LineDetail = {
  history: string;
  funFacts: string[];
  keyEngineers?: string[];
  originalNames?: OriginalName[];
};

export type LineDetails = {
  [lineId: string]: LineDetail;
};
