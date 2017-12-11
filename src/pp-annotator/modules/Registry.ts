interface IComponent {
  [whatever: string]: any;
}

interface IUtilities {
  [whatever: string]: IComponent;
}

export default class Registry {
  utilities: IUtilities = {};

  registerUtility(component: IComponent, iface: string) {
    this.utilities[iface] = component;
  }

  queryUtility(iface: string) {
    const component = this.utilities[iface];

    return component || null;
  }

  getUtility(iface: string) {
    const component = this.queryUtility(iface);

    if (!component) {
      throw new LookupError(iface);
    }

    return component;
  }
}

export class LookupError extends Error {
  constructor(iface: string) {
    super(`No utility registered for interface ${iface}.`);

    Object.setPrototypeOf(this, LookupError.prototype);
  }
}
