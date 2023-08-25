import { LogicFunction } from './filter.types';
export declare const filterNames: {
  none: string;
  empty: string;
  notEmpty: string;
  eq: string;
  notEq: string;
  begins: string;
  contains: string;
  notContains: string;
  eqN: string;
  neqN: string;
  gt: string;
  gte: string;
  lt: string;
  lte: string;
};
export type FilterType = keyof typeof filterNames;
export declare const filterEntities: Record<FilterType, LogicFunction>;
export declare const filterTypes: Record<string, FilterType[]>;
