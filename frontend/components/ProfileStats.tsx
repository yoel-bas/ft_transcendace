import React, { PureComponent } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'M',
    value: 100
  },
  {
    name: 'T',
    value: 0
  },
  {
    name: 'W',
    value: 20
  },
  {
    name: 'T',
    value: 35
  },
  {
    name: 'F',
    value: 60
  },
  {
    name: 'S',
    value: 10
  },
  {
    name: 'S',
    value: 90
  },
];

export default class Example extends PureComponent  {
  static demoUrl = 'https://codesandbox.io/p/sandbox/simple-area-chart-4y9cnl';

  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="#border: 2px solid #00FFF0" fill="#00FFF0" />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
}
