import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent, Switcher } from '@antv/s2-react';
import insertCss from 'insert-css';
import '@antv/s2-react/dist/style.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/6eede6eb-8021-4da8-bb12-67891a5705b7.json',
)
  .then((res) => res.json())
  .then((data) => {
    const s2Options = {
      width: 600,
      height: 480,
    };

    const defaultFields = {
      rows: ['province', 'city'],
      columns: ['type'],
      values: ['price', 'cost'],
    };

    const defaultSwitcherFields = {
      rows: {
        items: [{ id: 'province' }, { id: 'city' }],
      },
      columns: {
        items: [{ id: 'type' }],
      },
      values: {
        selectable: true,
        items: [{ id: 'price' }, { id: 'cost' }],
      },
    };

    // 生成 switcher 所需要的 fields 结构
    function generateSwitcherFields(updatedResult) {
      return {
        rows: { items: updatedResult.rows.items },
        columns: { items: updatedResult.columns.items },
        values: {
          selectable: true,
          items: updatedResult.values.items,
        },
      };
    }

    // 生成 dataCfg fields 结构
    function generateFields(updatedResult) {
      return {
        rows: updatedResult.rows.items.map((i) => i.id),
        columns: updatedResult.columns.items.map((i) => i.id),
        values: updatedResult.values.items
          .filter(
            (i) =>
              !updatedResult.values.hideItems.find((hide) => hide.id === i.id),
          )
          .map((i) => i.id),
      };
    }

    const SwitcherDemo = () => {
      const [fields, setFields] = useState(defaultFields);
      const [switcherFields, setSwitcherFields] = useState(
        defaultSwitcherFields,
      );

      const onSubmit = (result) => {
        console.log('result:', result);
        setFields(generateFields(result));
        setSwitcherFields(generateSwitcherFields(result));
      };

      return (
        <div>
          <Switcher {...switcherFields} onSubmit={onSubmit} />
          <SheetComponent
            sheetType={'pivot'}
            adaptive={false}
            dataCfg={{ data, fields }}
            options={s2Options}
          />
        </div>
      );
    };

    ReactDOM.render(<SwitcherDemo />, document.getElementById('container'));
  });

insertCss(`
  .antv-s2-switcher-item.checkable-item {
    align-items: center;
  }
`);
