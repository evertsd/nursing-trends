import React from 'react';
import { Colors } from './library';

const Navbar = () => (
  <div
    className="w-100 pv2 ph3 bb bw2"
    style={{ backgroundColor: Colors.Grey.White, borderColor: Colors.Grey.Lightest }}>
    <h1 className="ma0" style={{ color: Colors.Blue }}>Nursing trends</h1>
  </div>
);

export default Navbar;
