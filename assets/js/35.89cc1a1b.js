(window.webpackJsonp=window.webpackJsonp||[]).push([[35],{414:function(e,t,o){"use strict";o.r(t);var r=o(44),d=Object(r.a)({},(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[o("h1",{attrs:{id:"api-docs"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#api-docs"}},[e._v("#")]),e._v(" API Docs")]),e._v(" "),o("div",{staticClass:"custom-block tip"},[o("p",{staticClass:"custom-block-title"},[e._v("TIP")]),e._v(" "),o("p",[e._v("Read "),o("a",{attrs:{href:"https://github.com/revolist/revogrid/blob/master/src/interfaces.d.ts",target:"_blank",rel:"noopener noreferrer"}},[e._v("type definition file"),o("OutboundLink")],1),e._v(" for the full interface information.\nAll complex properties such as "),o("code",[e._v("ColumnRegular")]),e._v(", "),o("code",[e._v("ColumnProp")]),e._v(", "),o("code",[e._v("ColumnDataSchemaModel")]),e._v(", etc. can be found there.")])]),e._v(" "),o("div",{staticClass:"custom-block warning"},[o("p",{staticClass:"custom-block-title"},[e._v("WARNING")]),e._v(" "),o("p",[e._v("For version 2 check "),o("a",{attrs:{href:"https://github.com/revolist/revogrid/blob/2.9.81/src/components/revo-grid/readme.md",target:"_blank",rel:"noopener noreferrer"}},[e._v("Readme 2.0"),o("OutboundLink")],1)])]),e._v(" "),o("h2",{attrs:{id:"properties"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#properties"}},[e._v("#")]),e._v(" Properties")]),e._v(" "),o("table",[o("thead",[o("tr",[o("th",[e._v("Property")]),e._v(" "),o("th",[e._v("Attribute")]),e._v(" "),o("th",[e._v("Description")]),e._v(" "),o("th",[e._v("Type")]),e._v(" "),o("th",[e._v("Default")])])]),e._v(" "),o("tbody",[o("tr",[o("td",[o("code",[e._v("autoSizeColumn")])]),e._v(" "),o("td",[o("code",[e._v("auto-size-column")])]),e._v(" "),o("td",[e._v("Autosize config Enable columns autoSize, for more details check @autoSizeColumn plugin By default disabled, hence operation is not resource efficient true to enable with default params (double header separator click for autosize) or provide config")]),e._v(" "),o("td",[o("code",[e._v("boolean \\| { mode?: ColumnAutoSizeMode; allColumns?: boolean; letterBlockSize?: number; preciseSize?: boolean; }")])]),e._v(" "),o("td",[o("code",[e._v("false")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("canFocus")])]),e._v(" "),o("td",[o("code",[e._v("can-focus")])]),e._v(" "),o("td",[e._v("When true cell focus appear.")]),e._v(" "),o("td",[o("code",[e._v("boolean")])]),e._v(" "),o("td",[o("code",[e._v("true")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("colSize")])]),e._v(" "),o("td",[o("code",[e._v("col-size")])]),e._v(" "),o("td",[e._v("Indicates default column size.")]),e._v(" "),o("td",[o("code",[e._v("number")])]),e._v(" "),o("td",[o("code",[e._v("100")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("columnTypes")])]),e._v(" "),o("td",[e._v("--")]),e._v(" "),o("td",[e._v("Types Every type represent multiple column properties Types will be merged but can be replaced with column properties")]),e._v(" "),o("td",[o("code",[e._v("{ [name: string]: ColumnType; }")])]),e._v(" "),o("td",[o("code",[e._v("{}")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("columns")])]),e._v(" "),o("td",[e._v("--")]),e._v(" "),o("td",[e._v("Columns - defines an array of grid columns. Can be column or grouped column.")]),e._v(" "),o("td",[o("code",[e._v("(ColumnRegular \\| ColumnGrouping)[]")])]),e._v(" "),o("td",[o("code",[e._v("[]")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("editors")])]),e._v(" "),o("td",[e._v("--")]),e._v(" "),o("td",[e._v("Custom editors register")]),e._v(" "),o("td",[o("code",[e._v("{ [name: string]: EditorCtr; }")])]),e._v(" "),o("td",[o("code",[e._v("{}")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("exporting")])]),e._v(" "),o("td",[o("code",[e._v("exporting")])]),e._v(" "),o("td",[e._v("Enables export plugin Can be boolean Can be export options")]),e._v(" "),o("td",[o("code",[e._v("boolean")])]),e._v(" "),o("td",[o("code",[e._v("false")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("filter")])]),e._v(" "),o("td",[o("code",[e._v("filter")])]),e._v(" "),o("td",[e._v("Enables filter plugin Can be boolean Can be filter collection")]),e._v(" "),o("td",[o("code",[e._v("boolean \\| { collection?: Record<ColumnProp, FilterCollectionItem>; include?: string[]; customFilters?: Record<string, CustomFilter>; }")])]),e._v(" "),o("td",[o("code",[e._v("false")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("frameSize")])]),e._v(" "),o("td",[o("code",[e._v("frame-size")])]),e._v(" "),o("td",[e._v("Defines how many rows/columns should be rendered outside visible area.")]),e._v(" "),o("td",[o("code",[e._v("number")])]),e._v(" "),o("td",[o("code",[e._v("1")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("grouping")])]),e._v(" "),o("td",[e._v("--")]),e._v(" "),o("td",[e._v("Group models by provided properties Define properties to be groped by")]),e._v(" "),o("td",[o("code",[e._v("{ props?: ColumnProp[]; expandedAll?: boolean; }")])]),e._v(" "),o("td",[o("code",[e._v("undefined")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("pinnedBottomSource")])]),e._v(" "),o("td",[e._v("--")]),e._v(" "),o("td",[e._v("Pinned bottom Source: {[T in ColumnProp]: any} - defines pinned bottom rows data source.")]),e._v(" "),o("td",[o("code",[e._v("DataType[]")])]),e._v(" "),o("td",[o("code",[e._v("[]")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("pinnedTopSource")])]),e._v(" "),o("td",[e._v("--")]),e._v(" "),o("td",[e._v("Pinned top Source: {[T in ColumnProp]: any} - defines pinned top rows data source.")]),e._v(" "),o("td",[o("code",[e._v("DataType[]")])]),e._v(" "),o("td",[o("code",[e._v("[]")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("plugins")])]),e._v(" "),o("td",[e._v("--")]),e._v(" "),o("td",[e._v("Custom grid plugins Has to be predefined during first grid init Every plugin should be inherited from BasePlugin")]),e._v(" "),o("td",[o("code",[e._v("(typeof Plugin)[]")])]),e._v(" "),o("td",[o("code",[e._v("undefined")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("range")])]),e._v(" "),o("td",[o("code",[e._v("range")])]),e._v(" "),o("td",[e._v("When true, user can range selection.")]),e._v(" "),o("td",[o("code",[e._v("boolean")])]),e._v(" "),o("td",[o("code",[e._v("false")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("readonly")])]),e._v(" "),o("td",[o("code",[e._v("readonly")])]),e._v(" "),o("td",[e._v("When true, grid in read only mode.")]),e._v(" "),o("td",[o("code",[e._v("boolean")])]),e._v(" "),o("td",[o("code",[e._v("false")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("resize")])]),e._v(" "),o("td",[o("code",[e._v("resize")])]),e._v(" "),o("td",[e._v("When true, columns are resizable.")]),e._v(" "),o("td",[o("code",[e._v("boolean")])]),e._v(" "),o("td",[o("code",[e._v("false")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("rowClass")])]),e._v(" "),o("td",[o("code",[e._v("row-class")])]),e._v(" "),o("td",[e._v("Row class property Define this property in rgRow object and this will be mapped as rgRow class")]),e._v(" "),o("td",[o("code",[e._v("string")])]),e._v(" "),o("td",[o("code",[e._v("''")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("rowDefinitions")])]),e._v(" "),o("td",[e._v("--")]),e._v(" "),o("td",[e._v("Row properies applied")]),e._v(" "),o("td",[o("code",[e._v("RowDefinition[]")])]),e._v(" "),o("td",[o("code",[e._v("[]")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("rowHeaders")])]),e._v(" "),o("td",[o("code",[e._v("row-headers")])]),e._v(" "),o("td",[e._v("Excel like show rgRow indexe per rgRow")]),e._v(" "),o("td",[o("code",[e._v("RowHeaders \\| boolean")])]),e._v(" "),o("td",[o("code",[e._v("undefined")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("rowSize")])]),e._v(" "),o("td",[o("code",[e._v("row-size")])]),e._v(" "),o("td",[e._v("Indicates default rgRow size. By default 0, means theme package size will be applied")]),e._v(" "),o("td",[o("code",[e._v("number")])]),e._v(" "),o("td",[o("code",[e._v("0")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("source")])]),e._v(" "),o("td",[e._v("--")]),e._v(" "),o("td",[e._v("Source - defines main data source. Can be an Object or 2 dimensional array([][]); Keys/indexes referenced from columns Prop")]),e._v(" "),o("td",[o("code",[e._v("DataType[]")])]),e._v(" "),o("td",[o("code",[e._v("[]")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("stretch")])]),e._v(" "),o("td",[o("code",[e._v("stretch")])]),e._v(" "),o("td",[e._v("Defines stretch strategy for columns with @StretchColumn plugin if there are more space on the right last column size would be increased")]),e._v(" "),o("td",[o("code",[e._v("boolean \\| string")])]),e._v(" "),o("td",[o("code",[e._v("true")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("theme")])]),e._v(" "),o("td",[o("code",[e._v("theme")])]),e._v(" "),o("td",[e._v("Theme name")]),e._v(" "),o("td",[o("code",[e._v('"compact" \\| "darkCompact" \\| "darkMaterial" \\| "default" \\| "material"')])]),e._v(" "),o("td",[o("code",[e._v("'default'")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("trimmedRows")])]),e._v(" "),o("td",[e._v("--")]),e._v(" "),o("td",[e._v("Trimmed rows Functionality which allows to hide rows from main data set")]),e._v(" "),o("td",[o("code",[e._v("{ [x: number]: boolean; }")])]),e._v(" "),o("td",[o("code",[e._v("{}")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("useClipboard")])]),e._v(" "),o("td",[o("code",[e._v("use-clipboard")])]),e._v(" "),o("td",[e._v("When true enable clipboard.")]),e._v(" "),o("td",[o("code",[e._v("boolean")])]),e._v(" "),o("td",[o("code",[e._v("true")])])])])]),e._v(" "),o("h2",{attrs:{id:"events"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#events"}},[e._v("#")]),e._v(" Events")]),e._v(" "),o("table",[o("thead",[o("tr",[o("th",[e._v("Event")]),e._v(" "),o("th",[e._v("Description")]),e._v(" "),o("th",[e._v("Type")])])]),e._v(" "),o("tbody",[o("tr",[o("td",[o("code",[e._v("aftercolumnresize")])]),e._v(" "),o("td",[e._v("After column resize Get resized columns")]),e._v(" "),o("td",[o("code",[e._v("CustomEvent<{ [x: string]: ColumnRegular; [x: number]: ColumnRegular; }>")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("aftercolumnsset")])]),e._v(" "),o("td",[e._v("Column updated")]),e._v(" "),o("td",[o("code",[e._v('CustomEvent<{ columns: ColumnCollection; order: Record<ColumnProp, "desc" \\| "asc">; }>')])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("afteredit")])]),e._v(" "),o("td",[e._v("After edit. Triggered when after data applied or Range changeged.")]),e._v(" "),o("td",[o("code",[e._v("CustomEvent<{ data: DataLookup; models: { [rowIndex: number]: DataType; }; type: DimensionRows; } \\| { prop: ColumnProp; model: DataType; val?: string; rowIndex: number; type: DimensionRows; }>")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("aftersourceset")])]),e._v(" "),o("td",[e._v("After rows updated")]),e._v(" "),o("td",[o("code",[e._v("CustomEvent<{ type: DimensionRows; source: DataType[]; }>")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("aftertrimmed")])]),e._v(" "),o("td",[e._v("Notify trimmed applied")]),e._v(" "),o("td",[o("code",[e._v("CustomEvent<any>")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("beforeaange")])]),e._v(" "),o("td",[e._v("Before range apply. Triggered before range applied. Use e.preventDefault() to prevent range.")]),e._v(" "),o("td",[o("code",[e._v("CustomEvent<{ type: DimensionRows; newRange: RangeArea; oldRange: RangeArea; newProps: ColumnProp[]; oldProps: ColumnProp[]; newData: { [key: number]: DataType; }; }>")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("beforeautofill")])]),e._v(" "),o("td",[e._v("Before autofill. Triggered before autofill applied. Use e.preventDefault() to prevent edit data apply.")]),e._v(" "),o("td",[o("code",[e._v("CustomEvent<{ type: DimensionRows; newRange: RangeArea; oldRange: RangeArea; newProps: ColumnProp[]; oldProps: ColumnProp[]; newData: { [key: number]: DataType; }; }>")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("beforecellfocus")])]),e._v(" "),o("td",[e._v("Before cell focus changed. Use e.preventDefault() to prevent cell focus change.")]),e._v(" "),o("td",[o("code",[e._v("CustomEvent<{ prop: ColumnProp; model: DataType; val?: string; rowIndex: number; type: DimensionRows; }>")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("beforecolumnapplied")])]),e._v(" "),o("td",[e._v("Before column applied but after column set gathered and viewport updated")]),e._v(" "),o("td",[o("code",[e._v("CustomEvent<{ columns: Record<DimensionCols, ColumnRegular[]>; columnGrouping: Record<DimensionCols, Group[]>; maxLevel: number; sort: Record<ColumnProp, ColumnRegular>; }>")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("beforecolumnsset")])]),e._v(" "),o("td",[e._v("Before column update")]),e._v(" "),o("td",[o("code",[e._v("CustomEvent<{ columns: Record<DimensionCols, ColumnRegular[]>; columnGrouping: Record<DimensionCols, Group[]>; maxLevel: number; sort: Record<ColumnProp, ColumnRegular>; }>")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("beforeedit")])]),e._v(" "),o("td",[e._v("Before edit event. Triggered before edit data applied. Use e.preventDefault() to prevent edit data set and use you own. Use e.val = {your value} to replace edit result with your own.")]),e._v(" "),o("td",[o("code",[e._v("CustomEvent<{ prop: ColumnProp; model: DataType; val?: string; rowIndex: number; type: DimensionRows; }>")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("beforeeditstart")])]),e._v(" "),o("td",[e._v("Before edit started Use e.preventDefault() to prevent edit")]),e._v(" "),o("td",[o("code",[e._v("CustomEvent<{ prop: ColumnProp; model: DataType; val?: string; rowIndex: number; type: DimensionRows; }>")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("beforeexport")])]),e._v(" "),o("td",[e._v("Before export Use e.preventDefault() to prevent export Replace data in Event in case you want to modify it in export")]),e._v(" "),o("td",[o("code",[e._v("CustomEvent<{ data: DataType[]; } & ColSource>")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("beforefilterapply")])]),e._v(" "),o("td",[e._v("Before filter applied to data source Use e.preventDefault() to prevent cell focus change Update @collection if you wish to change filters")]),e._v(" "),o("td",[o("code",[e._v("CustomEvent<{ collection: Record<ColumnProp, FilterCollectionItem>; }>")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("beforefiltertrimmed")])]),e._v(" "),o("td",[e._v("Before filter trimmed values Use e.preventDefault() to prevent value trimming and filter apply Update @collection if you wish to change filters Update @itemsToFilter if you wish to filter indexes of trimming")]),e._v(" "),o("td",[o("code",[e._v("CustomEvent<{ collection: Record<ColumnProp, FilterCollectionItem>; itemsToFilter: Record<number, boolean>; }>")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("beforefocuslost")])]),e._v(" "),o("td",[e._v("Before grid focus lost happened. Use e.preventDefault() to prevent cell focus change.")]),e._v(" "),o("td",[o("code",[e._v("CustomEvent<{ model: any; cell: Cell; colType: DimensionCols; rowType: DimensionRows; column?: ColumnRegular; }>")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("beforerangeedit")])]),e._v(" "),o("td",[e._v("Before range edit event. Triggered before range data applied, when range selection happened. Use e.preventDefault() to prevent edit data set and use you own.")]),e._v(" "),o("td",[o("code",[e._v("CustomEvent<{ data: DataLookup; models: { [rowIndex: number]: DataType; }; type: DimensionRows; }>")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("beforesorting")])]),e._v(" "),o("td",[e._v("Before sorting event. Initial sorting triggered, if this event stops no other event called. Use e.preventDefault() to prevent sorting.")]),e._v(" "),o("td",[o("code",[e._v('CustomEvent<{ column: ColumnRegular; order: "desc" \\| "asc"; }>')])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("beforesortingapply")])]),e._v(" "),o("td",[e._v("Before sorting apply. Use e.preventDefault() to prevent sorting data change.")]),e._v(" "),o("td",[o("code",[e._v('CustomEvent<{ column: ColumnRegular; order: "desc" \\| "asc"; }>')])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("beforesourceset")])]),e._v(" "),o("td",[e._v("Before data apply. You can override data source here")]),e._v(" "),o("td",[o("code",[e._v("CustomEvent<{ type: DimensionRows; source: DataType[]; }>")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("beforesourcesortingapply")])]),e._v(" "),o("td",[e._v("Before source update sorting apply. Use this event if you intended to prevent sorting on data update. Use e.preventDefault() to prevent sorting data change during rows source update.")]),e._v(" "),o("td",[o("code",[e._v("CustomEvent<any>")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("beforetrimmed")])]),e._v(" "),o("td",[e._v("Before trimmed values Use e.preventDefault() to prevent value trimming Update @trimmed if you wish to filter indexes of trimming")]),e._v(" "),o("td",[o("code",[e._v("CustomEvent<{ trimmed: Record<number, boolean>; trimmedType: string; type: string; }>")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("headerclick")])]),e._v(" "),o("td",[e._v("On header click.")]),e._v(" "),o("td",[o("code",[e._v("CustomEvent<ColumnRegular>")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("rowdragstart")])]),e._v(" "),o("td",[e._v("Row order change started. Use e.preventDefault() to prevent rgRow order change. Use e.text = 'new name' to change item name on start.")]),e._v(" "),o("td",[o("code",[e._v("CustomEvent<{ pos: PositionItem; text: string; }>")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("roworderchanged")])]),e._v(" "),o("td",[e._v("Before rgRow order apply. Use e.preventDefault() to prevent rgRow order change.")]),e._v(" "),o("td",[o("code",[e._v("CustomEvent<{ from: number; to: number; }>")])])]),e._v(" "),o("tr",[o("td",[o("code",[e._v("viewportscroll")])]),e._v(" "),o("td",[e._v("Triggered when view port scrolled")]),e._v(" "),o("td",[o("code",[e._v("CustomEvent<{ dimension: DimensionType; coordinate: number; delta?: number; }>")])])])])]),e._v(" "),o("h2",{attrs:{id:"methods"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#methods"}},[e._v("#")]),e._v(" Methods")]),e._v(" "),o("h3",{attrs:{id:"addtrimmed-trimmed-record-number-boolean-trimmedtype-string-type-revogrid-dimensionrows-promise-customevent-trimmed-record-number-boolean-trimmedtype-string-type-string"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#addtrimmed-trimmed-record-number-boolean-trimmedtype-string-type-revogrid-dimensionrows-promise-customevent-trimmed-record-number-boolean-trimmedtype-string-type-string"}},[e._v("#")]),e._v(" "),o("code",[e._v("addTrimmed(trimmed: Record<number, boolean>, trimmedType?: string, type?: RevoGrid.DimensionRows) => Promise<CustomEvent<{ trimmed: Record<number, boolean>; trimmedType: string; type: string; }>>")])]),e._v(" "),o("p",[e._v("Add trimmed by type")]),e._v(" "),o("h4",{attrs:{id:"returns"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#returns"}},[e._v("#")]),e._v(" Returns")]),e._v(" "),o("p",[e._v("Type: "),o("code",[e._v("Promise<CustomEvent<{ trimmed: Record<number, boolean>; trimmedType: string; type: string; }>>")])]),e._v(" "),o("h3",{attrs:{id:"clearfocus-promise-void"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#clearfocus-promise-void"}},[e._v("#")]),e._v(" "),o("code",[e._v("clearFocus() => Promise<void>")])]),e._v(" "),o("p",[e._v("Clear current grid focus")]),e._v(" "),o("h4",{attrs:{id:"returns-2"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#returns-2"}},[e._v("#")]),e._v(" Returns")]),e._v(" "),o("p",[e._v("Type: "),o("code",[e._v("Promise<void>")])]),e._v(" "),o("h3",{attrs:{id:"getcolumnstore-type-revogrid-dimensioncols-promise-columnsource"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#getcolumnstore-type-revogrid-dimensioncols-promise-columnsource"}},[e._v("#")]),e._v(" "),o("code",[e._v("getColumnStore(type?: RevoGrid.DimensionCols) => Promise<ColumnSource>")])]),e._v(" "),o("p",[e._v("Provides access to column internal store observer\nCan be used for plugin support")]),e._v(" "),o("h4",{attrs:{id:"returns-3"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#returns-3"}},[e._v("#")]),e._v(" Returns")]),e._v(" "),o("p",[e._v("Type: "),o("code",[e._v("Promise<Observable<DataSourceState<ColumnRegular, DimensionCols>>>")])]),e._v(" "),o("h3",{attrs:{id:"getcolumns-promise-revogrid-columnregular"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#getcolumns-promise-revogrid-columnregular"}},[e._v("#")]),e._v(" "),o("code",[e._v("getColumns() => Promise<RevoGrid.ColumnRegular[]>")])]),e._v(" "),o("p",[e._v("Receive all columns in data source")]),e._v(" "),o("h4",{attrs:{id:"returns-4"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#returns-4"}},[e._v("#")]),e._v(" Returns")]),e._v(" "),o("p",[e._v("Type: "),o("code",[e._v("Promise<ColumnRegular[]>")])]),e._v(" "),o("h3",{attrs:{id:"getfocused-promise-focuseddata-null"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#getfocused-promise-focuseddata-null"}},[e._v("#")]),e._v(" "),o("code",[e._v("getFocused() => Promise<FocusedData | null>")])]),e._v(" "),o("p",[e._v("Get all active plugins instances")]),e._v(" "),o("h4",{attrs:{id:"returns-5"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#returns-5"}},[e._v("#")]),e._v(" Returns")]),e._v(" "),o("p",[e._v("Type: "),o("code",[e._v("Promise<FocusedData>")])]),e._v(" "),o("h3",{attrs:{id:"getplugins-promise-revoplugin-plugin"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#getplugins-promise-revoplugin-plugin"}},[e._v("#")]),e._v(" "),o("code",[e._v("getPlugins() => Promise<RevoPlugin.Plugin[]>")])]),e._v(" "),o("p",[e._v("Get all active plugins instances")]),e._v(" "),o("h4",{attrs:{id:"returns-6"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#returns-6"}},[e._v("#")]),e._v(" Returns")]),e._v(" "),o("p",[e._v("Type: "),o("code",[e._v("Promise<Plugin[]>")])]),e._v(" "),o("h3",{attrs:{id:"getsource-type-revogrid-dimensionrows-promise-revogrid-datatype"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#getsource-type-revogrid-dimensionrows-promise-revogrid-datatype"}},[e._v("#")]),e._v(" "),o("code",[e._v("getSource(type?: RevoGrid.DimensionRows) => Promise<RevoGrid.DataType[]>")])]),e._v(" "),o("p",[e._v("Get data from source")]),e._v(" "),o("h4",{attrs:{id:"returns-7"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#returns-7"}},[e._v("#")]),e._v(" Returns")]),e._v(" "),o("p",[e._v("Type: "),o("code",[e._v("Promise<DataType[]>")])]),e._v(" "),o("h3",{attrs:{id:"getsourcestore-type-revogrid-dimensionrows-promise-rowsource"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#getsourcestore-type-revogrid-dimensionrows-promise-rowsource"}},[e._v("#")]),e._v(" "),o("code",[e._v("getSourceStore(type?: RevoGrid.DimensionRows) => Promise<RowSource>")])]),e._v(" "),o("p",[e._v("Provides access to rows internal store observer\nCan be used for plugin support")]),e._v(" "),o("h4",{attrs:{id:"returns-8"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#returns-8"}},[e._v("#")]),e._v(" Returns")]),e._v(" "),o("p",[e._v("Type: "),o("code",[e._v("Promise<Observable<DataSourceState<DataType, DimensionRows>>>")])]),e._v(" "),o("h3",{attrs:{id:"getvisiblesource-type-revogrid-dimensionrows-promise-any"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#getvisiblesource-type-revogrid-dimensionrows-promise-any"}},[e._v("#")]),e._v(" "),o("code",[e._v("getVisibleSource(type?: RevoGrid.DimensionRows) => Promise<any[]>")])]),e._v(" "),o("p",[e._v("Get data from visible part of source\nTrimmed/filtered rows will be excluded")]),e._v(" "),o("h4",{attrs:{id:"returns-9"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#returns-9"}},[e._v("#")]),e._v(" Returns")]),e._v(" "),o("p",[e._v("Type: "),o("code",[e._v("Promise<any[]>")])]),e._v(" "),o("h3",{attrs:{id:"refresh-type-revogrid-dimensionrows-all-promise-void"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#refresh-type-revogrid-dimensionrows-all-promise-void"}},[e._v("#")]),e._v(" "),o("code",[e._v("refresh(type?: RevoGrid.DimensionRows | 'all') => Promise<void>")])]),e._v(" "),o("p",[e._v("Refreshes data viewport.\nCan be specific part as rgRow or pinned rgRow or 'all' by default.")]),e._v(" "),o("h4",{attrs:{id:"returns-10"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#returns-10"}},[e._v("#")]),e._v(" Returns")]),e._v(" "),o("p",[e._v("Type: "),o("code",[e._v("Promise<void>")])]),e._v(" "),o("h3",{attrs:{id:"registervnode-elements-vnode-promise-void"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#registervnode-elements-vnode-promise-void"}},[e._v("#")]),e._v(" "),o("code",[e._v("registerVNode(elements: VNode[]) => Promise<void>")])]),e._v(" "),o("p",[e._v("Register new virtual node inside of grid\nUsed for additional items creation such as plugin elements")]),e._v(" "),o("h4",{attrs:{id:"returns-11"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#returns-11"}},[e._v("#")]),e._v(" Returns")]),e._v(" "),o("p",[e._v("Type: "),o("code",[e._v("Promise<void>")])]),e._v(" "),o("h3",{attrs:{id:"scrolltocolumnindex-coordinate-number-promise-void"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#scrolltocolumnindex-coordinate-number-promise-void"}},[e._v("#")]),e._v(" "),o("code",[e._v("scrollToColumnIndex(coordinate?: number) => Promise<void>")])]),e._v(" "),o("p",[e._v("Scrolls view port to specified column index")]),e._v(" "),o("h4",{attrs:{id:"returns-12"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#returns-12"}},[e._v("#")]),e._v(" Returns")]),e._v(" "),o("p",[e._v("Type: "),o("code",[e._v("Promise<void>")])]),e._v(" "),o("h3",{attrs:{id:"scrolltocolumnprop-prop-revogrid-columnprop-promise-void"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#scrolltocolumnprop-prop-revogrid-columnprop-promise-void"}},[e._v("#")]),e._v(" "),o("code",[e._v("scrollToColumnProp(prop: RevoGrid.ColumnProp) => Promise<void>")])]),e._v(" "),o("p",[e._v("Scrolls view port to specified column prop")]),e._v(" "),o("h4",{attrs:{id:"returns-13"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#returns-13"}},[e._v("#")]),e._v(" Returns")]),e._v(" "),o("p",[e._v("Type: "),o("code",[e._v("Promise<void>")])]),e._v(" "),o("h3",{attrs:{id:"scrolltocoordinate-cell-partial-selection-cell-promise-void"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#scrolltocoordinate-cell-partial-selection-cell-promise-void"}},[e._v("#")]),e._v(" "),o("code",[e._v("scrollToCoordinate(cell: Partial<Selection.Cell>) => Promise<void>")])]),e._v(" "),o("p",[e._v("Scrolls view port to coordinate")]),e._v(" "),o("h4",{attrs:{id:"returns-14"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#returns-14"}},[e._v("#")]),e._v(" Returns")]),e._v(" "),o("p",[e._v("Type: "),o("code",[e._v("Promise<void>")])]),e._v(" "),o("h3",{attrs:{id:"scrolltorow-coordinate-number-promise-void"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#scrolltorow-coordinate-number-promise-void"}},[e._v("#")]),e._v(" "),o("code",[e._v("scrollToRow(coordinate?: number) => Promise<void>")])]),e._v(" "),o("p",[e._v("Scrolls view port to specified rgRow index")]),e._v(" "),o("h4",{attrs:{id:"returns-15"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#returns-15"}},[e._v("#")]),e._v(" Returns")]),e._v(" "),o("p",[e._v("Type: "),o("code",[e._v("Promise<void>")])]),e._v(" "),o("h3",{attrs:{id:"setcelledit-rgrow-number-prop-revogrid-columnprop-rowsource-revogrid-dimensionrows-promise-void"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#setcelledit-rgrow-number-prop-revogrid-columnprop-rowsource-revogrid-dimensionrows-promise-void"}},[e._v("#")]),e._v(" "),o("code",[e._v("setCellEdit(rgRow: number, prop: RevoGrid.ColumnProp, rowSource?: RevoGrid.DimensionRows) => Promise<void>")])]),e._v(" "),o("p",[e._v("Bring cell to edit mode")]),e._v(" "),o("h4",{attrs:{id:"returns-16"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#returns-16"}},[e._v("#")]),e._v(" Returns")]),e._v(" "),o("p",[e._v("Type: "),o("code",[e._v("Promise<void>")])]),e._v(" "),o("h3",{attrs:{id:"updatecolumnsorting-column-revogrid-columnregular-index-number-order-asc-desc-promise-revogrid-columnregular"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#updatecolumnsorting-column-revogrid-columnregular-index-number-order-asc-desc-promise-revogrid-columnregular"}},[e._v("#")]),e._v(" "),o("code",[e._v("updateColumnSorting(column: RevoGrid.ColumnRegular, index: number, order: 'asc' | 'desc') => Promise<RevoGrid.ColumnRegular>")])]),e._v(" "),o("p",[e._v("Update column sorting")]),e._v(" "),o("h4",{attrs:{id:"returns-17"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#returns-17"}},[e._v("#")]),e._v(" Returns")]),e._v(" "),o("p",[e._v("Type: "),o("code",[e._v("Promise<ColumnRegular>")])]),e._v(" "),o("h3",{attrs:{id:"updatecolumns-cols-revogrid-columnregular-promise-void"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#updatecolumns-cols-revogrid-columnregular-promise-void"}},[e._v("#")]),e._v(" "),o("code",[e._v("updateColumns(cols: RevoGrid.ColumnRegular[]) => Promise<void>")])]),e._v(" "),o("p",[e._v("Update columns")]),e._v(" "),o("h4",{attrs:{id:"returns-18"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#returns-18"}},[e._v("#")]),e._v(" Returns")]),e._v(" "),o("p",[e._v("Type: "),o("code",[e._v("Promise<void>")])])])}),[],!1,null,null,null);t.default=d.exports}}]);