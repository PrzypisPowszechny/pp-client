export interface Relation {
  link?: string;
  data: APIModel | null;
}

export interface CreateRelation {
  data: APIModel | null;
}

export interface Relations {
  link: string;
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
