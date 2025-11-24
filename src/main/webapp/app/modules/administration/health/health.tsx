import React, { useEffect, useRef, useState } from 'react';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Badge } from 'app/shared/components';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSystemHealth } from '../administration.reducer';
import HealthModal from './health-modal';

export const HealthPage = () => {
  const [healthObject, setHealthObject] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [fetchDuration, setFetchDuration] = useState<number | null>(null);
  const [announce, setAnnounce] = useState('');
  const [refreshInterval, setRefreshInterval] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const dispatch = useAppDispatch();

  const health = useAppSelector(state => state.administration.health);
  const isFetching = useAppSelector(state => state.administration.loading);
  const prevStatusRef = useRef<string | null>(null);

  useEffect(() => {
    performFetch();
  }, []);

  // Auto-refresh handler
  useEffect(() => {
    if (intervalId) {
      window.clearInterval(intervalId);
      setIntervalId(null);
    }
    if (refreshInterval > 0) {
      const id = window.setInterval(() => {
        if (!isFetching) {
          performFetch();
        }
      }, refreshInterval);
      setIntervalId(id);
      return () => window.clearInterval(id);
    }
    return undefined;
    // Intentionally not including performFetch in deps to avoid resetting timer each fetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshInterval, isFetching]);

  // Notify on status changes (degraded/recovered)
  useEffect(() => {
    const current = health?.status;
    const prev = prevStatusRef.current;
    if (current) {
      if (prev && current !== prev) {
        if (current !== 'UP') {
          toast.error(
            // i18n note: Using English strings for now; can be replaced with <Translate> if we move to a banner
            `Health degraded: overall status is ${current}`,
          );
        } else {
          toast.success('Health recovered: overall status is UP');
        }
      }
      prevStatusRef.current = current;
    }
  }, [health?.status]);

  // Re-fetch when tab gains visibility
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && !isFetching) {
        performFetch();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [isFetching]);

  const performFetch = () => {
    const start = performance.now();
    dispatch(getSystemHealth()).finally(() => {
      const end = performance.now();
      setLastUpdated(new Date());
      setFetchDuration(Math.round(end - start));
      setAnnounce(`Health status updated at ${new Date().toLocaleTimeString()}`);
    });
  };

  const fetchSystemHealth = () => {
    if (!isFetching) {
      performFetch();
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

  const overallStatus = health?.status || 'UNKNOWN';
  const statusColorMap: Record<string, string> = {
    UP: 'bg-green-600',
    DOWN: 'bg-red-600',
    OUT_OF_SERVICE: 'bg-yellow-600',
    UNKNOWN: 'bg-gray-500',
  };
  const statusIconMap: Record<string, any> = {
    UP: 'check-circle',
    DOWN: 'times-circle',
    OUT_OF_SERVICE: 'exclamation-triangle',
    UNKNOWN: 'question-circle',
  };

  const componentKeys = Object.keys(data).filter(k => k !== 'status');
  const hasComponents = componentKeys.length > 0;

  return (
    <div>
      <h2 id="health-page-heading" data-cy="healthPageHeading" className="sr-only">
        <Translate contentKey="health.title">Health Checks</Translate>
      </h2>
      {/* Summary Banner */}
      <div
        className={`flex items-center gap-4 p-4 rounded-md text-white mb-4 ${statusColorMap[overallStatus]}`}
        role="status"
        aria-live="polite"
      >
        <FontAwesomeIcon icon={statusIconMap[overallStatus]} size="lg" />
        <div className="flex-1">
          <div className="text-lg font-semibold">
            <Translate contentKey="health.overall">Overall Status</Translate>: {overallStatus}
          </div>
          <div className="text-sm opacity-90">
            {lastUpdated ? (
              <>
                <Translate contentKey="health.lastUpdated">Last Updated</Translate>: {lastUpdated.toLocaleTimeString()} · {fetchDuration} ms
              </>
            ) : (
              <Translate contentKey="health.never">Not yet fetched</Translate>
            )}
          </div>
        </div>
        <Button onClick={fetchSystemHealth} variant={isFetching ? 'danger' : 'light'} disabled={isFetching}>
          <FontAwesomeIcon icon="sync" spin={isFetching} />
          <span className="ml-2">
            <Translate contentKey="health.refresh.button">Refresh</Translate>
          </span>
        </Button>
        <div className="ml-3 flex items-center text-sm">
          <label htmlFor="auto-refresh" className="mr-2">
            <Translate contentKey="health.autoRefresh">Auto-refresh</Translate>
          </label>
          <select
            id="auto-refresh"
            className="border border-gray-300 rounded px-2 py-1 bg-white text-gray-800"
            value={refreshInterval}
            onChange={e => setRefreshInterval(Number(e.target.value))}
          >
            <option value={0}>
              <Translate contentKey="health.interval.off">Off</Translate>
            </option>
            <option value={15000}>
              <Translate contentKey="health.interval.15s">15s</Translate>
            </option>
            <option value={60000}>
              <Translate contentKey="health.interval.60s">60s</Translate>
            </option>
          </select>
        </div>
      </div>
      <div className="sr-only" aria-live="polite">
        {announce}
      </div>
      {/* Components Table or Empty State */}
      {hasComponents ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200" aria-describedby="health-page-heading">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Translate contentKey="health.table.service">Service Name</Translate>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Translate contentKey="health.table.status">Status</Translate>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Translate contentKey="health.details.details">Details</Translate>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {componentKeys.map((configPropKey, configPropIndex) => (
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
                        aria-label={`View details for ${configPropKey}`}
                      >
                        <FontAwesomeIcon icon="eye" />
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6 border border-dashed border-gray-300 rounded-md text-center text-sm text-gray-600" data-cy="healthEmptyState">
          <FontAwesomeIcon icon="check-circle" className="text-green-500 mb-2" size="2x" />
          <p className="mb-1">
            <Translate contentKey="health.empty.message">No component breakdown available for this runtime.</Translate>
          </p>
          <p className="text-xs">
            <Translate contentKey="health.empty.hint">Add extended health details in the backend to populate this table.</Translate>
          </p>
        </div>
      )}
      {renderModal()}
    </div>
  );
};

export default HealthPage;
