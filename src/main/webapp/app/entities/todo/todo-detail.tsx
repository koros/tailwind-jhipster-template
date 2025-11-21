import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './todo.reducer';

export const TodoDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const todoEntity = useAppSelector(state => state.todo.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="todoDetailsHeading">
          <Translate contentKey="myTailwindJhipsterApp.todo.detail.title">Todo</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{todoEntity.id}</dd>
          <dt>
            <span id="title">
              <Translate contentKey="myTailwindJhipsterApp.todo.title">Title</Translate>
            </span>
          </dt>
          <dd>{todoEntity.title}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="myTailwindJhipsterApp.todo.description">Description</Translate>
            </span>
          </dt>
          <dd>{todoEntity.description}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="myTailwindJhipsterApp.todo.status">Status</Translate>
            </span>
          </dt>
          <dd>{todoEntity.status}</dd>
          <dt>
            <span id="priority">
              <Translate contentKey="myTailwindJhipsterApp.todo.priority">Priority</Translate>
            </span>
          </dt>
          <dd>{todoEntity.priority}</dd>
          <dt>
            <span id="dueDate">
              <Translate contentKey="myTailwindJhipsterApp.todo.dueDate">Due Date</Translate>
            </span>
          </dt>
          <dd>{todoEntity.dueDate ? <TextFormat value={todoEntity.dueDate} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="completed">
              <Translate contentKey="myTailwindJhipsterApp.todo.completed">Completed</Translate>
            </span>
          </dt>
          <dd>{todoEntity.completed ? 'true' : 'false'}</dd>
        </dl>
        <Button tag={Link} to="/todo" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/todo/${todoEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default TodoDetail;
