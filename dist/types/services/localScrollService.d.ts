import { RevoGrid } from '../interfaces';
interface Config {
  skipAnimationFrame?: boolean;
  beforeScroll(e: RevoGrid.ViewPortScrollEvent): void;
  afterScroll(e: RevoGrid.ViewPortScrollEvent): void;
}
type Params = {
  contentSize: number;
  virtualContentSize?: number;
  clientSize: number;
  virtualSize: number;
  maxSize?: number;
};
export default class LocalScrollService {
  private cfg;
  private preventArtificialScroll;
  private previousScroll;
  private params;
  constructor(cfg: Config);
  static getVirtualContentSize(contentSize: number, clientSize: number, virtualSize?: number): number;
  setParams(params: Params, dimension: RevoGrid.DimensionType): void;
  setScroll(e: RevoGrid.ViewPortScrollEvent): Promise<void>;
  scroll(coordinate: number, dimension: RevoGrid.DimensionType, force?: boolean, delta?: number, outside?: boolean): void;
  private getParams;
  private wrapCoordinate;
  private cancelScroll;
  private convert;
}
export {};
