// Typing necessary to load .json files in Typescript
declare module "*.json" {
    const value: any;
    export default value;
}