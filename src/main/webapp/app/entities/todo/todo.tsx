import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { JhiItemCount, TextFormat, Translate, getPaginationState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { Button, Pagination } from 'app/shared/components';
import { APP_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './todo.reducer';

export const Todo = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const todoList = useAppSelector(state => state.todo.entities);
  const loading = useAppSelector(state => state.todo.loading);
  const totalItems = useAppSelector(state => state.todo.totalItems);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(pageLocation.search);
    const page = params.get('page');
    const sort = params.get(SORT);
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [pageLocation.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = paginationState.sort;
    const order = paginationState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    }
    return order === ASC ? faSortUp : faSortDown;
  };

  return (
    <div>
      <h2 id="todo-heading" data-cy="TodoHeading">
        <Translate contentKey="myTailwindJhipsterApp.todo.home.title">Todos</Translate>
        <div className="flex justify-end">
          <Button className="mr-2" variant="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="myTailwindJhipsterApp.todo.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Button tag={Link} to="/todo/new" variant="primary" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="myTailwindJhipsterApp.todo.home.createLabel">Create new Todo</Translate>
          </Button>
        </div>
      </h2>
      <div className="overflow-x-auto">
        {todoList && todoList.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={sort('id')}
                >
                  <Translate contentKey="myTailwindJhipsterApp.todo.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={sort('title')}
                >
                  <Translate contentKey="myTailwindJhipsterApp.todo.title">Title</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('title')} />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={sort('description')}
                >
                  <Translate contentKey="myTailwindJhipsterApp.todo.description">Description</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('description')} />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={sort('status')}
                >
                  <Translate contentKey="myTailwindJhipsterApp.todo.status">Status</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('status')} />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={sort('priority')}
                >
                  <Translate contentKey="myTailwindJhipsterApp.todo.priority">Priority</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('priority')} />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={sort('dueDate')}
                >
                  <Translate contentKey="myTailwindJhipsterApp.todo.dueDate">Due Date</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('dueDate')} />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={sort('completed')}
                >
                  <Translate contentKey="myTailwindJhipsterApp.todo.completed">Completed</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('completed')} />
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {todoList.map((todo, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Button tag={Link} to={`/todo/${todo.id}`} variant="link" size="sm">
                      {todo.id}
                    </Button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{todo.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{todo.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Translate contentKey={`myTailwindJhipsterApp.TodoStatus.${todo.status}`} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Translate contentKey={`myTailwindJhipsterApp.Priority.${todo.priority}`} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {todo.dueDate ? <TextFormat type="date" value={todo.dueDate} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{todo.completed ? 'true' : 'false'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <div className="inline-flex space-x-2">
                      <Button tag={Link} to={`/todo/${todo.id}`} variant="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="hidden md:inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/todo/${todo.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        variant="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="hidden md:inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() =>
                          (window.location.href = `/todo/${todo.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
                        }
                        variant="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
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
        ) : (
          !loading && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
              <Translate contentKey="myTailwindJhipsterApp.todo.home.notFound">No Todos found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={todoList && todoList.length > 0 ? 'mt-4 space-y-4' : 'hidden'}>
          <div className="flex justify-center text-sm text-gray-600">
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
          </div>
          <div className="flex justify-center">
            <Pagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
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

export default Todo;
