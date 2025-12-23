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

  const getInitial = (firstName: string) => {
    return firstName?.charAt(0)?.toUpperCase() || '';
  };

  const getColorFromName = (fullName: string) => {
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      // eslint-disable-next-line no-bitwise
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 65%, 50%)`;
  };

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
        <div className="flex justify-end">
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
        <table className="min-w-full divide-y divide-primary">
          <thead className="bg-surface">
            <tr>
              <th className="py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider" />
              <th className="py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider hand" onClick={sort('login')}>
                <Translate contentKey="userManagement.login">Login</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('login')} />
              </th>
              <th className="py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider hand" onClick={sort('email')}>
                <Translate contentKey="userManagement.email">Email</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('email')} />
              </th>
              <th className="py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider hand" onClick={sort('activated')}>
                <Translate contentKey="userManagement.activated">Activated</Translate>{' '}
                <FontAwesomeIcon icon={getSortIconByFieldName('activated')} />
              </th>
              <th className="py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider hand" onClick={sort('langKey')}>
                <Translate contentKey="userManagement.langKey">Lang Key</Translate>{' '}
                <FontAwesomeIcon icon={getSortIconByFieldName('langKey')} />
              </th>
              <th className="py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                <Translate contentKey="userManagement.profiles">Profiles</Translate>
              </th>
              <th className="py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider hand" onClick={sort('createdDate')}>
                <Translate contentKey="userManagement.createdDate">Created Date</Translate>{' '}
                <FontAwesomeIcon icon={getSortIconByFieldName('createdDate')} />
              </th>
              <th
                className="py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider hand"
                onClick={sort('lastModifiedBy')}
              >
                <Translate contentKey="userManagement.lastModifiedBy">Last Modified By</Translate>{' '}
                <FontAwesomeIcon icon={getSortIconByFieldName('lastModifiedBy')} />
              </th>
              <th
                id="modified-date-sort"
                className="py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider hand"
                onClick={sort('lastModifiedDate')}
              >
                <Translate contentKey="userManagement.lastModifiedDate">Last Modified Date</Translate>{' '}
                <FontAwesomeIcon icon={getSortIconByFieldName('lastModifiedDate')} />
              </th>
              <th className="py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider" />
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr id={user.login} key={`user-${i}`} className="border-b border-primary hover:bg-surface transition-colors">
                <td className="py-4">
                  <div className="flex items-center">
                    {user.imageUrl ? (
                      <img src={user.imageUrl} alt={user.login} className="w-10 h-10 rounded-full object-cover border-2 border-primary" />
                    ) : (
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-sm border-2 border-primary"
                        style={{ backgroundColor: getColorFromName(`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.login) }}
                      >
                        {getInitial(user.firstName || user.login)}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 text-primary">{user.login}</td>
                <td className="py-4 text-secondary">{user.email}</td>
                <td className="py-4">
                  <button
                    onClick={toggleActive(user)}
                    disabled={account.login === user.login}
                    className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      user.activated ? 'bg-green-500' : 'bg-gray-200'
                    } ${account.login === user.login ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    title={
                      account.login === user.login ? 'You cannot deactivate your own account' : user.activated ? 'Deactivate' : 'Activate'
                    }
                  >
                    <span
                      className={`${
                        user.activated ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-1 rtl:-translate-x-1'
                      } inline-block h-4 w-4 rounded-full bg-white transition-transform`}
                    />
                  </button>
                </td>
                <td className="py-4 text-secondary">{user.langKey}</td>
                <td className="py-4">
                  {user.authorities
                    ? user.authorities.map((authority, j) => (
                        <div key={`user-auth-${i}-${j}`}>
                          <Badge variant="info">{authority}</Badge>
                        </div>
                      ))
                    : null}
                </td>
                <td className="py-4 text-secondary">
                  {user.createdDate ? <TextFormat value={user.createdDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid /> : null}
                </td>
                <td className="py-4 text-secondary">{user.lastModifiedBy}</td>
                <td className="py-4 text-secondary">
                  {user.lastModifiedDate ? (
                    <TextFormat value={user.lastModifiedDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
                  ) : null}
                </td>
                <td className="py-4 text-end">
                  <div className="inline-flex space-x-2">
                    <Button tag={Link} to={user.login} variant="info" size="sm" style={{ borderRadius: '15px', padding: '4px 15px' }}>
                      <FontAwesomeIcon icon="eye" />{' '}
                      <span className="hidden md:inline">
                        <Translate contentKey="entity.action.view">View</Translate>
                      </span>
                    </Button>
                    <Button
                      tag={Link}
                      to={`${user.login}/edit`}
                      variant="primary"
                      size="sm"
                      style={{ borderRadius: '15px', padding: '4px 15px' }}
                    >
                      <FontAwesomeIcon icon="pencil-alt" />{' '}
                      <span className="hidden md:inline">
                        <Translate contentKey="entity.action.edit">Edit</Translate>
                      </span>
                    </Button>
                    <Button
                      tag={Link}
                      to={`${user.login}/delete`}
                      variant="danger"
                      size="sm"
                      disabled={account.login === user.login}
                      style={{ borderRadius: '15px', padding: '4px 15px' }}
                    >
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
          <div className="flex justify-center text-sm text-secondary">
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
