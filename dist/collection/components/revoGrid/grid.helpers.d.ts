import { RevoGrid } from '../../interfaces';
export declare const rowDefinitionByType: (newVal?: RevoGrid.RowDefinition[]) => Partial<{
  rgRow: {
    sizes?: Record<number, number>;
  };
  rowPinStart: {
    sizes?: Record<number, number>;
  };
  rowPinEnd: {
    sizes?: Record<number, number>;
  };
}>;
export declare const rowDefinitionRemoveByType: (oldVal?: RevoGrid.RowDefinition[]) => Partial<{
  rgRow: number[];
  rowPinStart: number[];
  rowPinEnd: number[];
}>;
