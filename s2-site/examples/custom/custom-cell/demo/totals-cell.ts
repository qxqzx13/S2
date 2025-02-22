import { PivotSheet, RowCell, renderRect } from '@antv/s2';

/**
 * 继承 RowCell, 单独修改小计/总计的背景色和文字颜色
 * 查看更多方法 https://github.com/antvis/S2/blob/master/packages/s2-core/src/cell/row-cell.ts
 */
class CustomTotalsRowCell extends RowCell {
  // 背景色
  drawBackgroundShape() {
    // 总计
    if (this.meta.isGrandTotals) {
      this.backgroundShape = renderRect(this, {
        ...this.getCellArea(),
        fill: '#f63',
        fillOpacity: 0.9,
      });
      return;
    }

    // 小计
    if (this.meta.isSubTotals) {
      this.backgroundShape = renderRect(this, {
        ...this.getCellArea(),
        fill: '#06a',
        fillOpacity: 0.9,
      });
      return;
    }

    return super.drawBackgroundShape();
  }

  // 文字
  getTextStyle() {
    const originTextStyle = super.getTextStyle();

    // 总计
    if (this.meta.isGrandTotals) {
      return {
        ...originTextStyle,
        fill: '#fff',
        fontWeight: 800,
        fontSize: 16,
      };
    }

    // 小计
    if (this.meta.isSubTotals) {
      return {
        ...originTextStyle,
        fill: '#fff',
        fontWeight: 800,
        fontSize: 12,
      };
    }

    return super.getTextStyle();
  }
}

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
)
  .then((res) => res.json())
  .then((res) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
      },
      meta: res.meta,
      data: res.data,
    };
    const s2Options = {
      width: 600,
      height: 480,
      interaction: {
        hoverHighlight: false,
      },
      totals: {
        row: {
          showGrandTotals: true,
          showSubTotals: true,
          subTotalsDimensions: ['province'],
        },
        col: {
          showGrandTotals: true,
          showSubTotals: true,
          subTotalsDimensions: ['type'],
        },
      },
      rowCell: (node, s2, headConfig) => {
        return new CustomTotalsRowCell(node, s2, headConfig);
      },
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    s2.render();
  });
