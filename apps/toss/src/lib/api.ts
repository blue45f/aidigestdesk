import data from '../sample-data.json';

export interface Source {
  id: string; title: string; publisher: string; kind: string; kindLabel: string;
  priority: string; url: string; excerpt: string;
}

const items: Source[] = ((data as { items?: Source[] }).items || []);
export function getSources(): Source[] { return items; }
export function getSource(id: string): Source | undefined { return items.find((s) => s.id === id); }
