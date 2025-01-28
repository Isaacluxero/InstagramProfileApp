import React, { useContext, useState, useEffect } from 'react';
import { BusinessInstagramContext } from './BusinessInstagramContext';

function HashTags() {
  const { businessInstagramId } = useContext(BusinessInstagramContext);

  return (
    <div>
      <h1>User Metrics Page</h1>
    </div>
  );
}

export default HashTags;