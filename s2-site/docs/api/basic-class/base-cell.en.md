---
title: BaseCell
order: 4
---
Function description: cell base class. [details](https://github.com/antvis/S2/blob/master/packages/s2-core/src/cell/base-cell.ts)

| parameter              | illustrate                             | type                                                                    |
| ---------------------- | -------------------------------------- | ----------------------------------------------------------------------- |
| getMeta                | Get cell metadata                      | () => [ViewMeta](#viewmeta)                                             |
| setMeta                | Set cell metadata                      | (vieMeta: [ViewMeta](#viewmeta) ) => void                               |
| getIconStyle           | Get cell icon style                    | () => [IconTheme](/docs/api/general/S2Theme#icontheme)               |
| getStyle               | get cell style                         | () => [DefaultCellTheme](/docs/api/general/S2Theme#defaultcelltheme) |
| getTextAndIconPosition | Get the position of cell text and icon | (iconCount: `number` ) => [TextAndIconPosition](#textandiconposition)   |
| getActualText          | get the drawn text                     | `() => string`                                                          |
| cellType               | cell type                              | [CellTypes](#celltypes)                                                 |
| initCell               | Initialize cells                       | `() => void`                                                            |
| update                 | update cell                            | `() => void`                                                            |
| getTextStyle           | get text style                         | `() => void`                                                            |
| getFormattedFieldValue | Get the formatted field value          | `() => { formattedValue: string, value: string }`                       |
| getMaxTextWidth        | Get the maximum width of the text      | `() => number`                                                          |
| getTextPosition        | get text coordinates                   | [point](#point)                                                         |
| getContentArea         | get content area                       | `() => { x: number, y: number, width: number, height: number }`         |
| updateByState          | Update cell styles based on state      | `(stateName: InteractionStateName, cell: S2CellType) => void`           |
| hideInteractionShape   | Interactive layers for hidden cells    | `() => void`                                                            |
| clearUnselectedState   | clear unchecked                        | `() => void`                                                            |
| getTextShape | get text shape | `() => IShape` |
| getTextShapes | get all text shape | `() => IShape[]` |
| addTextShape | add text shape | `(shape: IShape) => void` |
| getConditionIconShape | get icon shape | `() => GuiIcon` |
| getConditionIconShapes | get all icon shape | `() => GuiIcon[]` |
| addConditionIconShape | add icon shape | `(shape: GuiIcon) => void` |

<embed src="@/docs/common/view-meta.en.md"></embed>

### point

```ts
interface Point {
  x: number,
  y: number
}
```

### TextAndIconPosition

```ts
interface TextAndIconPosition {
  text: Point
  icon: Point
}
```

### CellTypes

```ts
export enum CellTypes {
  DATA_CELL = 'dataCell',
  HEADER_CELL = 'headerCell',
  ROW_CELL = 'rowCell',
  COL_CELL = 'colCell',
  CORNER_CELL = 'cornerCell',
  MERGED_CELL = 'mergedCell',
}
```

### S2CellType

```ts
import type { SimpleBBox } from '@antv/g-canvas';

export type S2CellType<T extends SimpleBBox = ViewMeta> =
  | DataCell
  | HeaderCell
  | ColCell
  | CornerCell
  | RowCell
  | MergedCell
  | BaseCell<T>;
```
