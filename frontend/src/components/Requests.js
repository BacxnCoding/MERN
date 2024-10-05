import React from 'react';

function Requests({ requests, handleApproveRequest }) {
  return (
    <div>
      <h3>Requests</h3>
      <ul>
        {requests.map((request) => (
          <li key={request._id}>
            {request.item} (x{request.quantity}) - {request.status}
            {request.status === 'pending' && (
              <>
                <button
                  onClick={() =>
                    handleApproveRequest(
                      request._id,
                      'approved',
                      prompt('Enter approval message:')
                    )
                  }
                >
                  Approve
                </button>
                <button
                  onClick={() =>
                    handleApproveRequest(
                      request._id,
                      'denied',
                      prompt('Enter denial message:')
                    )
                  }
                >
                  Deny
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Requests;
