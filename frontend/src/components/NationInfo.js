import React from 'react';

const NationInfo = ({ nation, user }) => {
  const roles = user?.roles || [];

  return (
    <div>
      <h3>Nation General Info</h3>
      <p><strong>Name:</strong> {nation?.name}</p>
      <p><strong>National Bank:</strong> ${nation?.nationalBank}</p>
      <p><strong>People Index:</strong> {nation?.peopleindex}</p>
      <p><strong>Military Index:</strong> {nation?.militaryindex}</p>
      <p><strong>Economy Index:</strong> {nation?.economyindex}</p>

      {/* Conditionally render military data */}
      {roles.includes('military') && (
        <>
          <h3>Military Details</h3>
          <p><strong>Total Budget:</strong> {nation?.military?.TotalBudget}</p>
          <p><strong>Personnel Training:</strong> {nation?.military?.personnel?.training}</p>
          <p><strong>Well-being:</strong> {nation?.military?.personnel?.wellBeing}</p>
          <p><strong>Bases:</strong> {nation?.military?.equipment?.bases}</p>
          <p><strong>Ports:</strong> {nation?.military?.equipment?.ports}</p>
        </>
      )}

      {/* Conditionally render finance data */}
      {roles.includes('finance') && (
        <>
          <h3>Finance Details</h3>
          <h3>Income</h3>
          <p><strong>Tax Rate:</strong> {nation?.economy?.income?.taxRate}</p>
          <p><strong>Exports:</strong> {nation?.economy?.income?.exports}</p>
          <h3>Spending</h3>
          <p><strong>Debt:</strong> {nation?.economy?.spending?.debt}</p>
          <p><strong>Imports:</strong> {nation?.economy?.spending?.imports}</p>
        </>
      )}

      {/* Conditionally render social data */}
      {roles.includes('social') && (
        <>
          <h3>Social Info</h3>
          <p><strong>TotalBudget:</strong> {nation?.people?.TotalBudget}</p>
          <p><strong>Health Procedures:</strong> {nation?.people?.health?.procedures}</p>
          <p><strong>Hospitals:</strong> {nation?.people?.health?.hospitals}</p>
          <p><strong>Education:</strong> {nation?.people?.satisfaction?.education}</p>
          <p><strong>Freedom:</strong> {nation?.people?.satisfaction?.freedom}</p>
        </>
      )}
    </div>
  );
};

export default NationInfo;
