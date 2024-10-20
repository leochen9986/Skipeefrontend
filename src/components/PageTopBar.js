import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './componentsST.scss';
import dropdownIcon from 'src/assets/icon_svg/dropdown.svg';
import calendarIcon from 'src/assets/icon_svg/calendar.svg';

const CustomInput = React.forwardRef(({ value, onClick,currentPage  }, ref) => (
  <div
    ref={ref}
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      backgroundColor: '#EDEDEE',
      border: 'none',
      borderRadius: '50px',
      padding: '4px',
      paddingLeft: '10px',
      paddingRight: '10px',
      height: '40px',
    }}
  >
    <input
      type="text"
      value={value}
      readOnly
      style={{
        border: 'none',
        outline: 'none',
        flexGrow: 1,
        backgroundColor: 'transparent',
      }}
    />
    <img
      src={currentPage === 'dashboard' ? dropdownIcon : calendarIcon}
      width="20"
      height="20"
      alt="Dropdown Icon"
    />
  </div>
));
// Custom header for the date picker
const CustomHeader = ({ date, decreaseMonth, increaseMonth, onCancel, onClear, onOk }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <button onClick={decreaseMonth} style={buttonStyle}>&lt;</button>
        <span>{date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}</span>
        <button onClick={increaseMonth} style={buttonStyle}>&gt;</button>
      </div>

      {/* Calendar Days */}
      <div style={{ marginTop: '10px' }} />

      {/* Buttons below the calendar */}
      <div style={{ marginTop: '10px', display: 'flex', width: '100%' }}>
        {/* Clear button aligned to the left */}
        <div style={{ flex: 1 }}>
          <button onClick={onClear} style={buttonStyle}>Clear</button>
        </div>
        {/* Cancel and OK buttons aligned to the right */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
          <button onClick={onCancel} style={buttonStyle}>Cancel</button>
          <button onClick={onOk} style={{ ...buttonStyle, color: '#1DB954', marginLeft: '10px' }}>OK</button>
        </div>
      </div>
    </div>
  );
};

// Common button style
const buttonStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  color: 'black',
  cursor: 'pointer',
  padding: '5px 10px',
};

const PageTopBar = ({ startDate, endDate, setDateRange, picker , currentPage }) => {
  // Temporary state to hold selected dates
  const [tempDateRange, setTempDateRange] = useState([startDate, endDate]);

  const handleClear = () => {
    setTempDateRange([null, null]);
  };

  const handleOk = () => {
    // Update the actual date range state when OK is clicked
    setDateRange(tempDateRange);
  };

  const handleCancel = () => {
    // Reset temporary date range to the original selected dates
    setTempDateRange([startDate, endDate]);
  };

  return (
    <>
      <div
        style={{
          width: 'auto',
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px',
          justifyContent: 'flex-end', 
          position: 'relative', 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Optional date display or other elements can go here */}
        </div>
        {picker && (
          <div className="date-range-picker">
            <DatePicker
              selectsRange={true}
              startDate={tempDateRange[0]}
              endDate={tempDateRange[1]}
              onChange={(update) => {
                setTempDateRange(update);
              }}
              maxDate={new Date()}
              minDate={new Date(2024, 1, 1)}
              isClearable={false}
              customInput={<CustomInput currentPage={currentPage} />}
              className="custom-datepicker"
              renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                <CustomHeader 
                  date={date} 
                  decreaseMonth={decreaseMonth} 
                  increaseMonth={increaseMonth} 
                  onCancel={handleCancel} 
                  onClear={handleClear} 
                  onOk={handleOk} 
                />
              )}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default PageTopBar; 