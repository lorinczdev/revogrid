/* eslint-disable */
/* tslint:disable */
// @ts-ignore
import { VNode } from './stencil-public-runtime';
// @ts-ignore
import { ObservableMap, Subscription } from '@stencil/store';
import { type } from 'os';
export type Observable<T> = ObservableMap<T>;
export type PluginSubscribe<T> = Subscription<T>;
export declare namespace RevoGrid {
  type DimensionTypeRow = 'rgRow';
  type DimensionTypeCol = 'rgCol';
  type DimensionColPin = 'colPinStart' | 'colPinEnd';
  type DimensionRowPin = 'rowPinStart' | 'rowPinEnd';
  type DimensionType = DimensionTypeCol | DimensionTypeRow;
  type DimensionCols = DimensionColPin | DimensionTypeCol;
  type DimensionRows = DimensionTypeRow | DimensionRowPin;
  type MultiDimensionType = DimensionCols | DimensionRows;
  type ColumnDataSchemaModel = {
    prop: ColumnProp;
    model: DataType;
    column: ColumnRegular;
    rowIndex: number;
    colIndex: number;
    colType: DimensionCols;
    type: DimensionRows;
    data: DataSource;
  };
  type CellTemplateProp = {
    providers: Providers;
  } & ColumnDataSchemaModel;
  type ReadOnlyFormat = boolean | ((params: ColumnDataSchemaModel) => boolean);
  type RowDrag = boolean | {
    (params: ColumnDataSchemaModel): boolean;
  };
  interface ColumnGrouping {
    children: ColumnDataSchema[];
    name: DataFormat;
  }
  interface ColumnProperties {
    /** column inner template */
    columnTemplate?: ColumnTemplateFunc;
    /** cell properties */
    columnProperties?: ColPropertiesFunc;
  }
  type ColumnTypes = {
    [name: string]: RevoGrid.ColumnType;
  };
  interface CellTemplate {
    // TODO: Add Promise support for template and all custom function so user will be able to use async render on the light speed
    (createElement: HyperFunc<VNode>, props: CellTemplateProp, additionalData?: any): any;
  }
  interface ColumnType extends ColumnProperties {
    /** is column or cell readonly */
    readonly?: ReadOnlyFormat;
    /** cell properties */
    cellProperties?: PropertiesFunc;
    /** cell inner template, now template is async */
    cellTemplate?: CellTemplate;
    /** cell compare function */
    cellCompare?: CellCompareFunc;
    /** default column size */
    size?: number;
    /**
     * minimal column size
     * this property can not be less than cell padding
     * in order to keep performance on top and minimize dom elements number
     */
    minSize?: number;
    /**  max column size */
    maxSize?: number;
    /** represents custom editor defined in @editors property */
    editor?: string | Edition.EditorCtr;
  }
  type Order = 'asc' | 'desc' | undefined;
  interface ColumnRegular extends ColumnType {
    // mapping to data, it's object keys/props, @required used for indexing
    prop: ColumnProp;
    // column pin 'colPinStart'|'colPinEnd'
    pin?: DimensionColPin;
    // column header
    name?: DataFormat;
    // is column can be sorted
    sortable?: boolean;
    // column size would be changed based on content size
    autoSize?: boolean;
    // filter
    filter?: boolean | string | string[];
    order?: Order;
    // is cell in column or individual can be dragged
    rowDrag?: RowDrag;
    // represents type defined in @columnTypes property
    columnType?: string;
    // called before column applied to the store
    beforeSetup?(rgCol: ColumnRegular): void;
    // other keys
    [key: string]: any;
  }
  type ColumnDataSchema = ColumnGrouping | ColumnRegular;
  type ColumnData = ColumnDataSchema[];
  type ColumnTemplateProp = ColumnRegular & {
    providers: Providers<RevoGrid.DimensionCols | 'rowHeaders'>;
    index: number;
  };
  type ColumnPropProp = ColumnGrouping | ColumnTemplateProp;
  // Regularly all column are indexed by prop
  type ColumnProp = string | number;
  type DataFormat = any;
  type CellProp = string | number | object | boolean | undefined;
  type CellProps = {
    style?: {
      [key: string]: string | undefined;
    };
    class?: {
      [key: string]: boolean;
    } | string;
    [attr: string]: CellProp;
  };
  type Providers<T = RevoGrid.DimensionRows> = {
    type: T;
    data: Observable<DataSourceState<any, any>>|RevoGrid.ColumnRegular[];
    viewport: Observable<ViewportState>;
    dimension: Observable<DimensionSettingsState>;
    selection: Observable<Selection.SelectionStoreState>;
  };
  interface HyperFunc<T> {
    (tag: any): T;
  }
  interface HyperFunc<T> {
    (tag: any, data: any): T;
  }
  interface HyperFunc<T> {
    (tag: any, text: string): T;
  }
  interface HyperFunc<T> {
    (sel: any, children: Array<T | undefined | null>): T;
  }
  interface HyperFunc<T> {
    (sel: any, data: any, text: string): T;
  }
  interface HyperFunc<T> {
    (sel: any, data: any, children: Array<T | undefined | null>): T;
  }
  interface HyperFunc<T> {
    (sel: any, data: any, children: T): T;
  }
  type FocusTemplateFunc = (createElement: HyperFunc<VNode>, detail: FocusRenderEvent) => any;
  type CellCompareFunc = (prop: ColumnProp, a: DataType, b: DataType) => number;
  type ColumnTemplateFunc = (createElement: HyperFunc<VNode>, props: ColumnTemplateProp, additionalData?: any) => any;
  type PropertiesFunc = (props: ColumnDataSchemaModel) => CellProps | void | undefined;
  type ColPropertiesFunc = (props: ColumnPropProp) => CellProps | void | undefined;
  type DataType = {
    [T in ColumnProp]: DataFormat;
  };
  type DataSource = DataType[];
  type DataLookup = {
    [rowIndex: number]: DataType;
  };
  type RowDefinition = {
    type: DimensionRows;
    size: number;
    index: number;
  };
  interface RowHeaders extends RevoGrid.ColumnRegular {
  }
  type ViewPortResizeEvent = {
    dimension: DimensionType;
    size: number;
    rowHeader?: boolean;
  };
  type ViewPortScrollEvent = {
    dimension: DimensionType;
    coordinate: number;
    delta?: number;
    outside?: boolean;
  };
  type InitialHeaderClick = {
    index: number;
    originalEvent: MouseEvent;
    column: RevoGrid.ColumnRegular;
  };
  type Range = {
    start: number;
    end: number;
  };
  type ViewportStateItems = {
    items: VirtualPositionItem[];
  } & Range;
  interface ViewportState extends ViewportStateItems {
    realCount: number;
    virtualSize: number;
  }
  type ViewSettingSizeProp = Record<string, number>;
  interface VirtualPositionItem extends PositionItem {
    size: number;
  }
  type DataSourceState<T extends DataType | ColumnRegular, ST extends DimensionRows | DimensionCols> = {
    // items - index based array for mapping to source tree
    items: number[];
    // all items, used as proxy for sorting, trimming and others
    proxyItems: number[];
    // original data source
    source: T[];
    // grouping
    groupingDepth: number;
    groups: Record<any, any>;
    // data source type
    type: ST;
    // trim data, to hide entities from visible data source
    trimmed: Record<any, any>;
  };
  interface PositionItem {
    itemIndex: number;
    start: number;
    end: number;
  }
  interface DimensionCalc {
    indexes: number[];
    count: number;
    positionIndexes: number[];
    positionIndexToItem: {
      [position: number]: PositionItem;
    };
    indexToItem: {
      [index: number]: PositionItem;
    };
    trimmed: Record<any, any>;
    sizes: ViewSettingSizeProp;
  }
  interface DimensionSettingsState extends DimensionCalc {
    realSize: number;
    originItemSize: number;
  }
}
export declare namespace RevoPlugin {
  class Plugin {
    constructor(revogrid: HTMLRevoGridElement, ...[]: Iterable<any>);
    destroy(): void;
  }
  class PluginExternal extends Plugin {
    constructor(revogrid: HTMLRevoGridElement, providers: Record<string, any>, ...[]: Iterable<any>);
  }
  type PluginClass = typeof Plugin;
}
export declare namespace Selection {
  type RowIndex = number;
  type ColIndex = number;
  type SelectionStoreState = {
    range: RangeArea | null;
    tempRange: RangeArea | null;
    tempRangeType: string | null;
    focus: Cell | null;
    edit: Edition.EditCellStore | null;
    lastCell: Cell | null;
  };
  type RangeArea = {
    x: ColIndex;
    y: RowIndex;
    x1: ColIndex;
    y1: RowIndex;
  };
  type TempRange = {
    type: string;
    area: RangeArea;
  };
  type OldNewRangeMapping = {
    [rowIndex: number]: {
      [T in RevoGrid.ColumnProp]: {
        rowIndex: number;
        colIndex: number;
        colProp: RevoGrid.ColumnProp;
      };
    };
  };
  type ChangedRange = {
    type: RevoGrid.DimensionRows;
    colType: RevoGrid.DimensionCols;
    newRange: RangeArea;
    oldRange: RangeArea;
    mapping: OldNewRangeMapping;
    newData: {
      [key: number]: RevoGrid.DataType;
    };
  };
  interface Cell {
    x: ColIndex;
    y: RowIndex;
  }
  type FocusedCells = {
    focus: Selection.Cell;
    end: Selection.Cell;
  };
  type RangeAreaCss = {
    left: string;
    top: string;
    width: string;
    height: string;
  };
}
export declare namespace Edition {
  import HyperFunc = RevoGrid.HyperFunc;
  type SaveData = string;
  type SaveDataDetails = {
    rgRow: Selection.RowIndex;
    rgCol: Selection.ColIndex;
    type: RevoGrid.DimensionRows;
    prop: RevoGrid.ColumnProp;
    val: any;
    preventFocus?: boolean;
  };

  type BeforeEdit = Edition.BeforeSaveDataDetails;

  type BeforeSaveDataDetails = {
    prop: RevoGrid.ColumnProp;
    model: RevoGrid.DataType;
    val?: SaveData;
    rowIndex: number;
    colIndex: number;
    colType: RevoGrid.DimensionCols;
    type: RevoGrid.DimensionRows;
  };
  type BeforeRangeSaveDataDetails = {
    data: RevoGrid.DataLookup;
    models: {
      [rowIndex: number]: RevoGrid.DataType;
    };
    type: RevoGrid.DimensionRows;
  };
  interface EditCellStore extends Selection.Cell {
    val?: SaveData;
  }
  type EditCell = EditCellStore & BeforeSaveDataDetails;
  type Editors = {
    [name: string]: EditorCtr;
  };
  interface EditorCtr {
    new (column: RevoGrid.ColumnRegular, saveCallback: (value: Edition.SaveData, preventFocus?: boolean) => void, cancelEditCallback: (focusNext?: boolean) => void): EditorBase;
  }
  interface EditorBase {
    element?: Element | null;
    editCell?: EditCell;
    // autosave usage when you want to return value for models
    getValue?(): any;
    // for editor plugin internal usage in case you want to stop auto save and use your own
    beforeAutoSave?(val?: any): boolean;
    beforeUpdate?(): void;
    componentDidRender?(): void;
    disconnectedCallback?(): void;
    render(createElement?: HyperFunc<VNode>, additionalData?: any): VNode | VNode[] | string | void;
  }
}
export declare namespace ThemeSpace {
  interface ThemePackage {
    defaultRowSize: number;
  }
  type ThemeConfig = {
    rowSize: number;
  };
  type Theme = 'default' | 'material' | 'compact' | 'darkMaterial' | 'darkCompact';
}
export type DimensionStores = {
  [T in RevoGrid.MultiDimensionType]: Observable<RevoGrid.DimensionSettingsState>;
};
export type ViewportStores = {
  [T in RevoGrid.MultiDimensionType]: Observable<RevoGrid.ViewportState>;
};

export type DragStartEvent = {
  originalEvent: MouseEvent;
  model: RevoGrid.ColumnDataSchemaModel;
};

export interface BeforeCellRenderEvent extends AllDimensionType {
  column: RevoGrid.VirtualPositionItem;
  row: RevoGrid.VirtualPositionItem;
  model: any;
}

export type AfterRendererEvent = {
  type: RevoGrid.DimensionType;
};

export interface AllDimensionType {
  rowType: RevoGrid.DimensionRows;
  colType: RevoGrid.DimensionCols;
}

export type ApplyFocusEvent = AllDimensionType & Selection.FocusedCells;
export interface FocusRenderEvent extends AllDimensionType {
  range: Selection.RangeArea;
  next?: Partial<Selection.Cell>;
}
export type ScrollCoordinateEvent = {
  type: RevoGrid.DimensionType;
  coordinate: number;
};
