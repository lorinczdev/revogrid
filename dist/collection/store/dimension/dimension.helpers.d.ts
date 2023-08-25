import { RevoGrid } from '../../interfaces';
export type DimensionPosition = Pick<RevoGrid.DimensionSettingsState, 'indexes' | 'positionIndexes' | 'originItemSize' | 'positionIndexToItem'>;
export type DimensionIndexInput = Pick<RevoGrid.DimensionSettingsState, 'indexes' | 'originItemSize' | 'indexToItem'>;
export type DimensionSize = Pick<RevoGrid.DimensionSettingsState, 'indexes' | 'positionIndexes' | 'positionIndexToItem' | 'indexToItem' | 'realSize' | 'sizes'>;
/**
 * Pre-calculation
 * Dimension custom sizes for each cell
 * Keeps only changed sizes, skips origin size
 */
export declare function calculateDimensionData(originItemSize: number, newSizes?: RevoGrid.ViewSettingSizeProp): {
  indexes: number[];
  positionIndexes: number[];
  positionIndexToItem: {
    [x: number]: RevoGrid.PositionItem;
  };
  indexToItem: {
    [index: number]: RevoGrid.PositionItem;
  };
  sizes: {
    [x: string]: number;
  };
};
/**
 * Calculate item by position
 */
export declare function getItemByPosition({ indexes, positionIndexes, originItemSize, positionIndexToItem }: DimensionPosition, pos: number): RevoGrid.PositionItem;
export declare function getItemByIndex(dimension: DimensionIndexInput, index: number): RevoGrid.PositionItem;
