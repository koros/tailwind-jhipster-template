import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { JhiItemCount, TextFormat, Translate, getPaginationState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';

import { Button, Badge, Pagination } from 'app/shared/components';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsersAsAdmin, updateUser } from './user-management.reducer';

export const UserManagement = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [pagination, setPagination] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const getUsersFromProps = () => {
    dispatch(
      getUsersAsAdmin({
        page: pagination.activePage - 1,
        size: pagination.itemsPerPage,
        sort: `${pagination.sort},${pagination.order}`,
      }),
    );
    const endURL = `?page=${pagination.activePage}&sort=${pagination.sort},${pagination.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    getUsersFromProps();
  }, [pagination.activePage, pagination.order, pagination.sort]);

  useEffect(() => {
    const params = new URLSearchParams(pageLocation.search);
    const page = params.get('page');
    const sortParam = params.get(SORT);
    if (page && sortParam) {
      const sortSplit = sortParam.split(',');
      setPagination({
        ...pagination,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [pageLocation.search]);

  const sort = p => () =>
    setPagination({
      ...pagination,
      order: pagination.order === ASC ? DESC : ASC,
      sort: p,
    });

  const handlePagination = currentPage =>
    setPagination({
      ...pagination,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    getUsersFromProps();
  };

  const toggleActive = user => () => {
    dispatch(
      updateUser({
        ...user,
        activated: !user.activated,
      }),
    );
  };

  const account = useAppSelector(state => state.authentication.account);
  const users = useAppSelector(state => state.userManagement.users);
  const totalItems = useAppSelector(state => state.userManagement.totalItems);
  const loading = useAppSelector(state => state.userManagement.loading);
  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = pagination.sort;
    const order = pagination.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    }
    return order === ASC ? faSortUp : faSortDown;
  };

  return (
    <div>
      <h2 id="user-management-page-heading" data-cy="userManagementPageHeading">
        <Translate contentKey="userManagement.home.title">Users</Translate>
        <div className="d-flex justify-content-end">
          <Button className="mr-2" variant="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="userManagement.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Button tag={Link} to="new" variant="primary">
            <FontAwesomeIcon icon="plus" /> <Translate contentKey="userManagement.home.createLabel">Create a new user</Translate>
          </Button>
        </div>
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hand" onClick={sort('id')}>
                <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
              </th>
              <th className="hand" onClick={sort('login')}>
                <Translate contentKey="userManagement.login">Login</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('login')} />
              </th>
              <th className="hand" onClick={sort('email')}>
                <Translate contentKey="userManagement.email">Email</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('email')} />
              </th>
              <th />
              <th className="hand" onClick={sort('langKey')}>
                <Translate contentKey="userManagement.langKey">Lang Key</Translate>{' '}
                <FontAwesomeIcon icon={getSortIconByFieldName('langKey')} />
              </th>
              <th>
                <Translate contentKey="userManagement.profiles">Profiles</Translate>
              </th>
              <th className="hand" onClick={sort('createdDate')}>
                <Translate contentKey="userManagement.createdDate">Created Date</Translate>{' '}
                <FontAwesomeIcon icon={getSortIconByFieldName('createdDate')} />
              </th>
              <th className="hand" onClick={sort('lastModifiedBy')}>
                <Translate contentKey="userManagement.lastModifiedBy">Last Modified By</Translate>{' '}
                <FontAwesomeIcon icon={getSortIconByFieldName('lastModifiedBy')} />
              </th>
              <th id="modified-date-sort" className="hand" onClick={sort('lastModifiedDate')}>
                <Translate contentKey="userManagement.lastModifiedDate">Last Modified Date</Translate>{' '}
                <FontAwesomeIcon icon={getSortIconByFieldName('lastModifiedDate')} />
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr id={user.login} key={`user-${i}`}>
                <td>
                  <Button tag={Link} to={user.login} color="link" size="sm">
                    {user.id}
                  </Button>
                </td>
                <td>{user.login}</td>
                <td>{user.email}</td>
                <td>
                  {user.activated ? (
                    <Button variant="success" onClick={toggleActive(user)}>
                      <Translate contentKey="userManagement.activated">Activated</Translate>
                    </Button>
                  ) : (
                    <Button variant="danger" onClick={toggleActive(user)}>
                      <Translate contentKey="userManagement.deactivated">Deactivated</Translate>
                    </Button>
                  )}
                </td>
                <td>{user.langKey}</td>
                <td>
                  {user.authorities
                    ? user.authorities.map((authority, j) => (
                        <div key={`user-auth-${i}-${j}`}>
                          <Badge variant="info">{authority}</Badge>
                        </div>
                      ))
                    : null}
                </td>
                <td>
                  {user.createdDate ? <TextFormat value={user.createdDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid /> : null}
                </td>
                <td>{user.lastModifiedBy}</td>
                <td>
                  {user.lastModifiedDate ? (
                    <TextFormat value={user.lastModifiedDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
                  ) : null}
                </td>
                <td className="text-end">
                  <div className="btn-group flex-btn-group-container">
                    <Button tag={Link} to={user.login} variant="info" size="sm">
                      <FontAwesomeIcon icon="eye" />{' '}
                      <span className="hidden md:inline">
                        <Translate contentKey="entity.action.view">View</Translate>
                      </span>
                    </Button>
                    <Button tag={Link} to={`${user.login}/edit`} variant="primary" size="sm">
                      <FontAwesomeIcon icon="pencil-alt" />{' '}
                      <span className="hidden md:inline">
                        <Translate contentKey="entity.action.edit">Edit</Translate>
                      </span>
                    </Button>
                    <Button tag={Link} to={`${user.login}/delete`} variant="danger" size="sm" disabled={account.login === user.login}>
                      <FontAwesomeIcon icon="trash" />{' '}
                      <span className="hidden md:inline">
                        <Translate contentKey="entity.action.delete">Delete</Translate>
                      </span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalItems ? (
        <div className={users?.length > 0 ? 'mt-4 space-y-4' : 'hidden'}>
          <div className="flex justify-center text-sm text-gray-600">
            <JhiItemCount page={pagination.activePage} total={totalItems} itemsPerPage={pagination.itemsPerPage} i18nEnabled />
          </div>
          <div className="flex justify-center">
            <Pagination
              activePage={pagination.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={pagination.itemsPerPage}
              totalItems={totalItems}
            />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default UserManagement;
