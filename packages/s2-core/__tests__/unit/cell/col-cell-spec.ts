/* eslint-disable @typescript-eslint/ban-ts-comment */
import { get, set } from 'lodash';
import { createPivotSheet } from 'tests/util/helpers';
import type { Node } from '@/facet/layout/node';
import { PivotDataSet } from '@/data-set';
import { SpreadSheet, PivotSheet } from '@/sheet-type';
import { EXTRA_FIELD, type Formatter, type TextAlign } from '@/common';
import { ColCell } from '@/cell';

const MockPivotSheet = PivotSheet as unknown as jest.Mock<PivotSheet>;
const MockPivotDataSet = PivotDataSet as unknown as jest.Mock<PivotDataSet>;

describe('Col Cell Tests', () => {
  let s2: SpreadSheet;

  beforeEach(() => {
    const container = document.createElement('div');

    s2 = new MockPivotSheet(container);
    const dataSet: PivotDataSet = new MockPivotDataSet(s2);
    s2.dataSet = dataSet;
  });

  describe('None-leaf Nodes Tests', () => {
    const node = {
      isLeaf: false,
      x: 0,
      y: 0,
      height: 30,
      width: 200,
    } as unknown as Node;

    const headerConfig = {
      width: 500, // col header width
      scrollContainsRowHeader: true,
      cornerWidth: 100,
      scrollX: 30, // 模拟滚动了 30px
    };

    const actualTextWidth = 40; // 文字长度

    test.each([
      ['left', 8], // col.padding.left
      ['center', 100], // col.width / 2
      ['right', 192], // col.width - col.padding.right
    ])(
      'should calc node text position in %s align mode',
      (textAlign: TextAlign, textX: number) => {
        s2.setThemeCfg({
          theme: {
            colCell: {
              bolderText: {
                textAlign,
              },
            },
          },
        });

        const colCell = new ColCell(node, s2, { ...headerConfig });
        set(colCell, 'actualTextWidth', actualTextWidth); // 文字总长度

        const getTextPosition = get(colCell, 'getTextPosition').bind(colCell);
        expect(getTextPosition()).toEqual({
          x: textX,
          y: 15,
        });
      },
    );

    test.each([
      ['left', 52], // col.padding.left + actualTextWidth + icon.margin.left
      ['center', 115], // col.width / 2 + (actualTextWidth + icon.margin.left + icon.width + icon.margin.right) / 2  - (icon.width + icon.margin.right)
      ['right', 178], // col.width - col.padding.right - icon.margin.right - icon.width
    ])(
      'should calc icon position in %s align mode',
      (textAlign: TextAlign, iconX: number) => {
        s2.setThemeCfg({
          theme: {
            colCell: {
              bolderText: {
                textAlign,
              },
            },
          },
        });
        s2.setOptions({
          headerActionIcons: [
            {
              iconNames: ['SortUp'],
              belongsCell: 'colCell',
              displayCondition: (meta) => {
                return !meta.isLeaf;
              },
              action: () => true,
            },
          ],
        });

        const colCell = new ColCell(node, s2, { ...headerConfig });
        set(colCell, 'actualTextWidth', actualTextWidth); // 文字总长度

        const getIconPosition = get(colCell, 'getIconPosition').bind(colCell);
        expect(getIconPosition()).toEqual({
          x: iconX,
          y: 10,
        });
      },
    );
  });

  describe('Col Cell Formatter Test', () => {
    const node = {
      id: 1,
      label: 'label',
      fieldValue: 'fieldValue',
      value: 'value',
      width: 100,
      height: 10,
    } as unknown as Node;

    test('should get correct col cell formatter', () => {
      const formatter = jest.fn();
      jest.spyOn(s2.dataSet, 'getFieldFormatter').mockReturnValue(formatter);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const colCell = new ColCell(node, s2);

      expect(formatter).toHaveBeenCalledWith(node.label, undefined, node);
    });

    test('should return correct formatted value', () => {
      const formatter: Formatter = jest.fn(() => 'test');

      jest.spyOn(s2.dataSet, 'getFieldFormatter').mockReturnValue(formatter);

      const colCell = new ColCell(node, s2);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(colCell.textShape.attr('text')).toEqual('test');
    });
  });

  describe('Condition Tests', () => {
    const s2 = createPivotSheet({
      conditions: {
        text: [
          {
            field: EXTRA_FIELD,
            mapping() {
              return {
                fill: '#5083F5',
              };
            },
          },
        ],
      },
    });
    test('should draw right condition text shape', () => {
      s2.render();
      const colCell = s2.facet.columnHeader
        .getChildByIndex(0)
        // @ts-ignore
        .getChildByIndex(1);

      expect(get(colCell, 'textShape.attrs.fill')).toEqual('#5083F5');
    });

    test('should draw right condition icon shape', () => {
      s2.setOptions({
        conditions: {
          icon: [
            {
              field: 'type',
              mapping(field) {
                if (field === '笔') {
                  return {
                    icon: 'CellUp',
                    fill: 'red',
                  };
                }
              },
            },
          ],
        },
      });
      s2.render();

      const colCell = s2.facet.columnHeader
        .getChildByIndex(0)
        // @ts-ignore
        .getChildByIndex(0);
      expect(get(colCell, 'conditionIconShape.cfg.name')).toEqual('CellUp');
      expect(get(colCell, 'conditionIconShape.cfg.fill')).toEqual('red');
    });

    test('should draw right condition background shape', () => {
      s2.setOptions({
        conditions: {
          background: [
            {
              field: EXTRA_FIELD,
              mapping() {
                return {
                  fill: '#F7B46F',
                };
              },
            },
          ],
        },
      });
      s2.render();
      const colCell = s2.facet.columnHeader
        .getChildByIndex(0)
        // @ts-ignore
        .getChildByIndex(1);
      expect(get(colCell, 'backgroundShape.attrs.fill')).toEqual('#F7B46F');
    });
  });
});
