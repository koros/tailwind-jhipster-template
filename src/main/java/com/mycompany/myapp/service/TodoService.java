package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Todo;
import com.mycompany.myapp.repository.TodoRepository;
import com.mycompany.myapp.service.dto.TodoDTO;
import com.mycompany.myapp.service.mapper.TodoMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.Todo}.
 */
@Service
@Transactional
public class TodoService {

    private static final Logger LOG = LoggerFactory.getLogger(TodoService.class);

    private final TodoRepository todoRepository;

    private final TodoMapper todoMapper;

    public TodoService(TodoRepository todoRepository, TodoMapper todoMapper) {
        this.todoRepository = todoRepository;
        this.todoMapper = todoMapper;
    }

    /**
     * Save a todo.
     *
     * @param todoDTO the entity to save.
     * @return the persisted entity.
     */
    public TodoDTO save(TodoDTO todoDTO) {
        LOG.debug("Request to save Todo : {}", todoDTO);
        Todo todo = todoMapper.toEntity(todoDTO);
        todo = todoRepository.save(todo);
        return todoMapper.toDto(todo);
    }

    /**
     * Update a todo.
     *
     * @param todoDTO the entity to save.
     * @return the persisted entity.
     */
    public TodoDTO update(TodoDTO todoDTO) {
        LOG.debug("Request to update Todo : {}", todoDTO);
        Todo todo = todoMapper.toEntity(todoDTO);
        todo = todoRepository.save(todo);
        return todoMapper.toDto(todo);
    }

    /**
     * Partially update a todo.
     *
     * @param todoDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<TodoDTO> partialUpdate(TodoDTO todoDTO) {
        LOG.debug("Request to partially update Todo : {}", todoDTO);

        return todoRepository
            .findById(todoDTO.getId())
            .map(existingTodo -> {
                todoMapper.partialUpdate(existingTodo, todoDTO);

                return existingTodo;
            })
            .map(todoRepository::save)
            .map(todoMapper::toDto);
    }

    /**
     * Get one todo by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<TodoDTO> findOne(Long id) {
        LOG.debug("Request to get Todo : {}", id);
        return todoRepository.findById(id).map(todoMapper::toDto);
    }

    /**
     * Delete the todo by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Todo : {}", id);
        todoRepository.deleteById(id);
    }
}
