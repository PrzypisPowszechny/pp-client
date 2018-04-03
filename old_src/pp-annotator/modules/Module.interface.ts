export default interface IModule {
  start?(...args: any[]): any;
  destroy?(...args: any[]): any;
  configure?(...args: any[]): any;

  [x: string]: any;
}
