import React from 'react';
import { Translate } from 'react-jhipster';

const PageNotFound = () => {
  return (
    <div>
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <Translate contentKey="error.http.404">The page does not exist.</Translate>
      </div>
    </div>
  );
};

export default PageNotFound;
