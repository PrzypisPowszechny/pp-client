export interface Relation {
  links: { related: string };
  data: APIModel | null;
}

export interface CreateRelation {
  data: APIModel | null;
}

export interface Relations {
  links: { related: string };
  data: APIModel[];
}

export interface APIModel {
  id: string;
  type: string;
}

export interface APICreateModel {
  id?: string;
  type: string;
}

export type ID = string;
