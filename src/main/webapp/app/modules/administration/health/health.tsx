import React, { useEffect, useState } from 'react';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Badge } from 'app/shared/components';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSystemHealth } from '../administration.reducer';
import HealthModal from './health-modal';

export const HealthPage = () => {
  const [healthObject, setHealthObject] = useState({});
  const [showModal, setShowModal] = useState(false);
  const dispatch = useAppDispatch();

  const health = useAppSelector(state => state.administration.health);
  const isFetching = useAppSelector(state => state.administration.loading);

  useEffect(() => {
    dispatch(getSystemHealth());
  }, []);

  const fetchSystemHealth = () => {
    if (!isFetching) {
      dispatch(getSystemHealth());
    }
  };

  const getSystemHealthInfo = (name, healthObj) => () => {
    setShowModal(true);
    setHealthObject({ ...healthObj, name });
  };

  const getBadgeVariant = (status: string) => (status !== 'UP' ? 'danger' : 'success');

  const handleClose = () => setShowModal(false);

  const renderModal = () => <HealthModal healthObject={healthObject} handleClose={handleClose} showModal={showModal} />;

  const data = (health || {}).components || {};

  return (
    <div>
      <h2 id="health-page-heading" data-cy="healthPageHeading">
        <Translate contentKey="health.title">Health Checks</Translate>
      </h2>
      <p>
        <Button onClick={fetchSystemHealth} variant={isFetching ? 'danger' : 'primary'} disabled={isFetching}>
          <FontAwesomeIcon icon="sync" />
          &nbsp;
          <Translate component="span" contentKey="health.refresh.button">
            Refresh
          </Translate>
        </Button>
      </p>
      <div>
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200" aria-describedby="health-page-heading">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Translate contentKey="health.table.service">Service Name</Translate>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Translate contentKey="health.table.status">Status</Translate>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Translate contentKey="health.details.details">Details</Translate>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.keys(data).map((configPropKey, configPropIndex) =>
                  configPropKey !== 'status' ? (
                    <tr key={configPropIndex}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{configPropKey}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge variant={getBadgeVariant(data[configPropKey].status)}>{data[configPropKey].status}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {data[configPropKey].details ? (
                          <button
                            onClick={getSystemHealthInfo(configPropKey, data[configPropKey])}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FontAwesomeIcon icon="eye" />
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ) : null,
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {renderModal()}
    </div>
  );
};

export default HealthPage;
