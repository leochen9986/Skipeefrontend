import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './components.scss';
import dropdownIcon from 'src/assets/icon_svg/dropdown.svg';
import calendarIcon from 'src/assets/icon_svg/calendar.svg';

const CustomInput = React.forwardRef(({ value, onClick, currentPage }, ref) => (
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

const CustomHeader = ({ date, decreaseMonth, increaseMonth, onCancel, onClear, onOk }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <button onClick={decreaseMonth} style={buttonStyle}>&lt;</button>
        <span>{date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}</span>
        <button onClick={increaseMonth} style={buttonStyle}>&gt;</button>
      </div>

      {/* Labels with colored circles */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, textAlign: 'center' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#1DB954', marginRight: '5px' }}></div>
          <span style={{ fontSize: '12px', color: '#909094' }}>Range</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, textAlign: 'center' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'white', border: '2px solid #1DB954', marginRight: '5px' }}></div>
          <span style={{ fontSize: '12px', color: '#909094' }}>Today</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, textAlign: 'center' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F06C8B', marginRight: '5px' }}></div>
          <span style={{ fontSize: '12px', color: '#909094' }}>Special Event</span>
        </div>
      </div>

      <div style={{ marginTop: '10px', display: 'flex', width: '100%' }}>
        <div style={{ flex: 1 }}>
          <button onClick={onClear} style={buttonStyle}>Clear</button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
          <button onClick={onCancel} style={buttonStyle}>Cancel</button>
          <button onClick={onOk} style={{ ...buttonStyle, color: '#1DB954', marginLeft: '10px' }}>OK</button>
        </div>
      </div>
    </div>
  );
};

const buttonStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  color: 'black',
  cursor: 'pointer',
  padding: '5px 10px',
};

const PageTopBar = ({ startDate, endDate, setDateRange, picker, currentPage }) => {
  const [tempDateRange, setTempDateRange] = useState([startDate, endDate]);

  const handleClear = () => {
    setTempDateRange([null, null]);
  };

  const handleOk = () => {
    setDateRange(tempDateRange);
  };

  const handleCancel = () => {
    setTempDateRange([startDate, endDate]);
  };

  // Fake special event dates
  const specialEventDates = [
    new Date(2024, 8, 19), // 19/09/2024
    new Date(2024, 9, 13), // 13/10/2024
  ];

  const isSpecialEventDate = (date) => {
    return specialEventDates.some(specialDate => 
      date.getDate() === specialDate.getDate() &&
      date.getMonth() === specialDate.getMonth() &&
      date.getFullYear() === specialDate.getFullYear()
    );
  };

  return (
    <>
      <div style={{ width: 'auto', display: 'flex', alignItems: 'center', marginBottom: '20px', justifyContent: 'flex-end', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}></div>
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
              dayClassName={(date) => 
                isSpecialEventDate(date) ? 'special-event' : undefined
              }
            />
          </div>
        )}
      </div>
    </>
  );
};

export default PageTopBar;
