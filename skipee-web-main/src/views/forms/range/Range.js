import React from 'react'

export const ViewTicketPrice = ({ amount, site }) => {
  const calculateComission = (amount) => {
    let comission = site?.baseCommission
    comission += (amount * site?.percentageCommission) / 100

    return Math.max(Math.min(comission, site?.maxCommission), site?.minCommission).toPrecision(2)
  }
  return (
    <>
      £ <strong>{amount}</strong> +{' '}
      <span>
        {' '}
        [ {amount - calculateComission(amount)} + {calculateComission(amount)} Charges]
      </span>
    </>
  )
}
