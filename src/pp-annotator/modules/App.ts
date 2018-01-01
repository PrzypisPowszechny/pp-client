import _ from 'lodash';

import IModule from '../modules/Module.interface';
import Registry from './Registry';
import { StorageAdapter } from '../legacy/old-storage';
import { storage } from 'annotator';

interface IConstructable<T> {
  new(...args: any[]): T;
}

export default class App implements IModule {
  modules: IModule[] = [];
  registry: Registry = new Registry();
  started: boolean = false;
  annotations: storage.IAnnotationStorage;

  include(module: IConstructable<IModule | any>, options?: any) {
    const mod = new module(options);

    if (_.isFunction(mod.configure)) {
      mod.configure(this.registry);
    }

    this.modules.push(mod);
  }

  notify(message: string, severity: string): void {
    console.log(`${severity.toUpperCase()}: ${message}`);
  }

  start() {
    if (this.started) {
      return console.warn('Application already started');
    }

    this.started = true;

    this.annotations = new StorageAdapter(
      this.registry.getUtility('storage'),
      this.runHook.bind(this),
    );

    return this.runHook('start', [this]);
  }

  destroy() {
    return this.runHook('destroy');
  }

  runHook(name: string, args?: any[]): Promise<any> {
    return Promise.all(this.modules.map((module) => {
        if (_.isFunction(module[name])) {
          return module[name].apply(module, args);
        }
      },
    ));
  }
}
