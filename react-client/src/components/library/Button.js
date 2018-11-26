import React from 'react';
import Colors from './colors';

const Button = ({ children, onClick, selected, style }) => (
  <button
    onClick={onClick}
    className="pv2 ph3 br ba1"
    style={{
      ...style,
      backgroundColor: selected ? Colors.Blue : Colors.Grey.White,
      borderColor: Colors.Grey.Darker,
      color: selected ? Colors.Grey.White : Colors.Grey.Black,
      WebkitAppearance: 'none',
    }}>{children}</button>
);

export default Button;
