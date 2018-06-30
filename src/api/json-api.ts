export abstract class Relation {
  link?: string;
  data: APIModel | null;
}

export abstract class CreateRelation {
  data: APIModel | null;
}

export abstract class Relations {
  link: string;
  data: APIModel[];
}

export abstract class APIModel {
  id: string;
  type: string;
}

export abstract class APICreateModel {
  id?: string;
  type: string;
}
