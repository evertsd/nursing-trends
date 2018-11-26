import React from 'react';
import { withState } from 'recompose';

export const withOzPerFeeding = withState('oz', 'setOz', 0);

const OzInput = ({ className, nursingAverage, oz, setOz, style }) => (
  <div className={className} style={style}>
    <label className="db mb2">Estimated oz. / ave nurse</label>
    <input
      className="mr1 pa2"
      value={oz}
      onChange={(e) => setOz(e.target.value)}
    /> oz. / {Math.round(nursingAverage)} min.
  </div>
)

export default OzInput;
