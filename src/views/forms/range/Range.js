import React from 'react'

export const ViewTicketPrice = ({ amount, site }) => {
  const calculateComission = (amount) => {
    let comission = site?.baseCommission
    comission += (amount * site?.percentageCommission) / 100

    return Math.max(Math.min(comission, site?.maxCommission), site?.minCommission).toPrecision(2)
  }
  return (
    <>
      <span style={{ fontSize: '24px' }}> {/* Main amount with larger font */}
        £ <strong>{amount}</strong>
      </span>
        {/* <br />
        <span style={{ fontSize: '12px' }}> 
          - £{isNaN(calculateComission(amount)) ? '0.0' : calculateComission(amount)} fees
          <br />
          + £{isNaN(calculateComission(amount)) ? '0.0' : calculateComission(amount)} fees
        </span> */}
    </>

  )
  
}


