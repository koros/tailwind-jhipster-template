import React, { useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'app/shared/components';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { TodoStatus } from 'app/shared/model/enumerations/todo-status.model';
import { Priority } from 'app/shared/model/enumerations/priority.model';
import { createEntity, getEntity, reset, updateEntity } from './todo.reducer';
import { toast } from 'react-toastify';

export const TodoUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const todoEntity = useAppSelector(state => state.todo.entity);
  const loading = useAppSelector(state => state.todo.loading);
  const updating = useAppSelector(state => state.todo.updating);
  const updateSuccess = useAppSelector(state => state.todo.updateSuccess);
  const errorMessage = useAppSelector(state => state.todo.errorMessage);
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

  const pendingToastId = useRef<string | number | null>(null);

  useEffect(() => {
    if (updateSuccess) {
      if (pendingToastId.current) {
        toast.update(pendingToastId.current, {
          render: isNew ? 'Todo created successfully' : 'Todo updated successfully',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
        pendingToastId.current = null;
      } else {
        toast.success(isNew ? 'Todo created successfully' : 'Todo updated successfully');
      }
      handleClose();
    }
  }, [updateSuccess]);

  useEffect(() => {
    if (errorMessage && pendingToastId.current) {
      toast.update(pendingToastId.current, {
        render: errorMessage,
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
      pendingToastId.current = null;
    } else if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);

  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }
    values.dueDate = convertDateTimeToServer(values.dueDate);

    const entity = {
      ...todoEntity,
      ...values,
    };

    // Optimistic toast: show saving immediately
    pendingToastId.current = toast.loading(isNew ? 'Creating todo...' : 'Updating todo...');
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
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2
          className="text-2xl font-bold text-primary"
          id="myTailwindJhipsterApp.todo.home.createOrEditLabel"
          data-cy="TodoCreateUpdateHeading"
        >
          <Translate contentKey="myTailwindJhipsterApp.todo.home.createOrEditLabel">Create or edit a Todo</Translate>
        </h2>
      </div>
      <div className="bg-card shadow-md rounded-lg p-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
            {!isNew ? (
              <ValidatedField name="id" required readOnly id="todo-id" label={translate('global.field.id')} validate={{ required: true }} />
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
            <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/todo" replace variant="info">
              <FontAwesomeIcon icon="arrow-left" />
              &nbsp;
              <span className="hidden md:inline">
                <Translate contentKey="entity.action.back">Back</Translate>
              </span>
            </Button>
            &nbsp;
            <Button variant="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
              <FontAwesomeIcon icon="save" />
              &nbsp;
              <Translate contentKey="entity.action.save">Save</Translate>
            </Button>
          </ValidatedForm>
        )}
      </div>
    </div>
  );
};

export default TodoUpdate;
