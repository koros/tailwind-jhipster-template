import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Translate } from 'react-jhipster';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { activateAction, reset } from './activate.reducer';

const successAlert = (
  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
    <Translate contentKey="activate.messages.success">
      <strong>Your user account has been activated.</strong> Please
    </Translate>
    <Link to="/login" className="text-green-700 underline hover:text-green-800">
      <Translate contentKey="global.messages.info.authenticated.link">sign in</Translate>
    </Link>
    .
  </div>
);

const failureAlert = (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
    <Translate contentKey="activate.messages.error">
      <strong>Your user could not be activated.</strong> Please use the registration form to sign up.
    </Translate>
  </div>
);

export const ActivatePage = () => {
  const dispatch = useAppDispatch();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const key = searchParams.get('key');

    dispatch(activateAction(key));
    return () => {
      dispatch(reset());
    };
  }, []);

  const { activationSuccess, activationFailure } = useAppSelector(state => state.activate);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          <Translate contentKey="activate.title">Activation</Translate>
        </h1>
      </div>
      <div>{activationSuccess ? successAlert : undefined}</div>
      <div>{activationFailure ? failureAlert : undefined}</div>
    </div>
  );
};

export default ActivatePage;
