import React from 'react';
import Style from './date-picker.module.scss';

function DatePicker(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <input className={Style.customDate} {...props} />
    </div>
  );
}

export default DatePicker;
