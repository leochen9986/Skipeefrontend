import React from 'react'

export const ViewTicketPrice = ({ amount, site }) => {
  const calculateCommission = (amount) => {
    if (!site) return 0;

    // Calculate percentage commission per ticket
    let percentageCommission = parseFloat(((amount * site.percentageCommission) / 100).toFixed(2));

    // Ensure the commission per ticket is at least the base commission
    let commissionPerTicket = Math.max(percentageCommission, site.baseCommission);

    // Apply min and max commission boundaries
    commissionPerTicket = Math.min(commissionPerTicket, site.maxCommission);
    commissionPerTicket = Math.max(commissionPerTicket, site.minCommission);

    return commissionPerTicket;
  };

  const commission = calculateCommission(amount);
  const totalPrice = parseFloat(amount) + commission;

  return (
    <>
      <span style={{ fontSize: '24px' }}> {/* Main amount with larger font */}
        £ <strong>{parseFloat(amount)}</strong>
      </span>
      {commission > 0 && (
        <span style={{ fontSize: '12px', color: '#bfbfbf', marginLeft: '8px' }}>
          + £{commission.toFixed(2)} fees
        </span>
      )}
    </>
  );
};
