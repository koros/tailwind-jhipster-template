import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { TodoStatus } from 'app/shared/model/enumerations/todo-status.model';
import { Priority } from 'app/shared/model/enumerations/priority.model';
import { createEntity, getEntity, reset, updateEntity } from './todo.reducer';

export const TodoUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const todoEntity = useAppSelector(state => state.todo.entity);
  const loading = useAppSelector(state => state.todo.loading);
  const updating = useAppSelector(state => state.todo.updating);
  const updateSuccess = useAppSelector(state => state.todo.updateSuccess);
  const todoStatusValues = Object.keys(TodoStatus);
  const priorityValues = Object.keys(Priority);

  const handleClose = () => {
    navigate(`/todo${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }
    values.dueDate = convertDateTimeToServer(values.dueDate);

    const entity = {
      ...todoEntity,
      ...values,
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          dueDate: displayDefaultDateTime(),
        }
      : {
          status: 'PENDING',
          priority: 'LOW',
          ...todoEntity,
          dueDate: convertDateTimeFromServer(todoEntity.dueDate),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="myTailwindJhipsterApp.todo.home.createOrEditLabel" data-cy="TodoCreateUpdateHeading">
            <Translate contentKey="myTailwindJhipsterApp.todo.home.createOrEditLabel">Create or edit a Todo</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="todo-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('myTailwindJhipsterApp.todo.title')}
                id="todo-title"
                name="title"
                data-cy="title"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  minLength: { value: 1, message: translate('entity.validation.minlength', { min: 1 }) },
                  maxLength: { value: 140, message: translate('entity.validation.maxlength', { max: 140 }) },
                }}
              />
              <ValidatedField
                label={translate('myTailwindJhipsterApp.todo.description')}
                id="todo-description"
                name="description"
                data-cy="description"
                type="textarea"
              />
              <ValidatedField
                label={translate('myTailwindJhipsterApp.todo.status')}
                id="todo-status"
                name="status"
                data-cy="status"
                type="select"
              >
                {todoStatusValues.map(todoStatus => (
                  <option value={todoStatus} key={todoStatus}>
                    {translate(`myTailwindJhipsterApp.TodoStatus.${todoStatus}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('myTailwindJhipsterApp.todo.priority')}
                id="todo-priority"
                name="priority"
                data-cy="priority"
                type="select"
              >
                {priorityValues.map(priority => (
                  <option value={priority} key={priority}>
                    {translate(`myTailwindJhipsterApp.Priority.${priority}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('myTailwindJhipsterApp.todo.dueDate')}
                id="todo-dueDate"
                name="dueDate"
                data-cy="dueDate"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label={translate('myTailwindJhipsterApp.todo.completed')}
                id="todo-completed"
                name="completed"
                data-cy="completed"
                check
                type="checkbox"
              />
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/todo" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default TodoUpdate;
