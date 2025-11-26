import React, { useEffect, useState } from 'react';
import { Translate } from 'react-jhipster';
import { Badge } from 'app/shared/components';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getConfigurations, getEnv } from '../administration.reducer';

export const ConfigurationPage = () => {
  const [filter, setFilter] = useState('');
  const [reversePrefix, setReversePrefix] = useState(false);
  const [reverseProperties, setReverseProperties] = useState(false);
  const dispatch = useAppDispatch();

  const configuration = useAppSelector(state => state.administration.configuration);

  useEffect(() => {
    dispatch(getConfigurations());
    dispatch(getEnv());
  }, []);

  const changeFilter = evt => setFilter(evt.target.value);

  const envFilterFn = configProp => configProp.toUpperCase().includes(filter.toUpperCase());

  const propsFilterFn = configProp => configProp.prefix.toUpperCase().includes(filter.toUpperCase());

  const changeReversePrefix = () => setReversePrefix(!reversePrefix);

  const changeReverseProperties = () => setReverseProperties(!reverseProperties);

  const getContextList = contexts =>
    Object.values(contexts)
      .map((v: any) => v.beans)
      .reduce((acc, e) => ({ ...acc, ...e }));

  const configProps = configuration?.configProps ?? {};

  const env = configuration?.env ?? {};

  return (
    <div>
      <h2 id="configuration-page-heading" data-cy="configurationPageHeading">
        <Translate contentKey="configuration.title">Configuration</Translate>
      </h2>
      <span>
        <Translate contentKey="configuration.filter">Filter</Translate>
      </span>{' '}
      <input
        type="search"
        value={filter}
        onChange={changeFilter}
        name="search"
        id="search"
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label>Spring configuration</label>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th onClick={changeReversePrefix} className="border border-gray-300 px-4 py-2 cursor-pointer">
              <Translate contentKey="configuration.table.prefix">Prefix</Translate>
            </th>
            <th onClick={changeReverseProperties} className="border border-gray-300 px-4 py-2 cursor-pointer">
              <Translate contentKey="configuration.table.properties">Properties</Translate>
            </th>
          </tr>
        </thead>
        <tbody>
          {configProps.contexts
            ? Object.values(getContextList(configProps.contexts))
                .filter(propsFilterFn)
                .map((property: any, propIndex) => (
                  <tr key={propIndex} className="odd:bg-white even:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{property.prefix}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {Object.keys(property.properties).map((propKey, index) => (
                        <div key={index} className="grid md:grid-cols-12 gap-4 mb-2">
                          <div className="md:col-span-4">{propKey}</div>
                          <div className="md:col-span-8">
                            <Badge variant="secondary" className="float-right break-words">
                              {JSON.stringify(property.properties[propKey])}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))
            : null}
        </tbody>
      </table>
      {env.propertySources
        ? env.propertySources.map((envKey, envIndex) => (
            <div key={envIndex}>
              <h4>
                <span>{envKey.name}</span>
              </h4>
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr key={envIndex}>
                    <th className="border border-gray-300 px-4 py-2 w-2/5">Property</th>
                    <th className="border border-gray-300 px-4 py-2 w-3/5">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(envKey.properties)
                    .filter(envFilterFn)
                    .map((propKey, propIndex) => (
                      <tr key={propIndex} className="odd:bg-white even:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 break-words">{propKey}</td>
                        <td className="border border-gray-300 px-4 py-2 break-words">
                          <Badge variant="secondary" className="float-right break-words">
                            {envKey.properties[propKey].value}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ))
        : null}
    </div>
  );
};

export default ConfigurationPage;
