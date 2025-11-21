package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.TodoAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Todo;
import com.mycompany.myapp.domain.enumeration.Priority;
import com.mycompany.myapp.domain.enumeration.TodoStatus;
import com.mycompany.myapp.repository.TodoRepository;
import com.mycompany.myapp.service.dto.TodoDTO;
import com.mycompany.myapp.service.mapper.TodoMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TodoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TodoResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final TodoStatus DEFAULT_STATUS = TodoStatus.PENDING;
    private static final TodoStatus UPDATED_STATUS = TodoStatus.IN_PROGRESS;

    private static final Priority DEFAULT_PRIORITY = Priority.LOW;
    private static final Priority UPDATED_PRIORITY = Priority.MEDIUM;

    private static final Instant DEFAULT_DUE_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DUE_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Boolean DEFAULT_COMPLETED = false;
    private static final Boolean UPDATED_COMPLETED = true;

    private static final String ENTITY_API_URL = "/api/todos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private TodoMapper todoMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTodoMockMvc;

    private Todo todo;

    private Todo insertedTodo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Todo createEntity() {
        return new Todo()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .status(DEFAULT_STATUS)
            .priority(DEFAULT_PRIORITY)
            .dueDate(DEFAULT_DUE_DATE)
            .completed(DEFAULT_COMPLETED);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Todo createUpdatedEntity() {
        return new Todo()
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .status(UPDATED_STATUS)
            .priority(UPDATED_PRIORITY)
            .dueDate(UPDATED_DUE_DATE)
            .completed(UPDATED_COMPLETED);
    }

    @BeforeEach
    void initTest() {
        todo = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedTodo != null) {
            todoRepository.delete(insertedTodo);
            insertedTodo = null;
        }
    }

    @Test
    @Transactional
    void createTodo() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Todo
        TodoDTO todoDTO = todoMapper.toDto(todo);
        var returnedTodoDTO = om.readValue(
            restTodoMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(todoDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            TodoDTO.class
        );

        // Validate the Todo in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedTodo = todoMapper.toEntity(returnedTodoDTO);
        assertTodoUpdatableFieldsEquals(returnedTodo, getPersistedTodo(returnedTodo));

        insertedTodo = returnedTodo;
    }

    @Test
    @Transactional
    void createTodoWithExistingId() throws Exception {
        // Create the Todo with an existing ID
        todo.setId(1L);
        TodoDTO todoDTO = todoMapper.toDto(todo);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTodoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(todoDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Todo in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        todo.setTitle(null);

        // Create the Todo, which fails.
        TodoDTO todoDTO = todoMapper.toDto(todo);

        restTodoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(todoDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStatusIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        todo.setStatus(null);

        // Create the Todo, which fails.
        TodoDTO todoDTO = todoMapper.toDto(todo);

        restTodoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(todoDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPriorityIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        todo.setPriority(null);

        // Create the Todo, which fails.
        TodoDTO todoDTO = todoMapper.toDto(todo);

        restTodoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(todoDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCompletedIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        todo.setCompleted(null);

        // Create the Todo, which fails.
        TodoDTO todoDTO = todoMapper.toDto(todo);

        restTodoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(todoDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTodos() throws Exception {
        // Initialize the database
        insertedTodo = todoRepository.saveAndFlush(todo);

        // Get all the todoList
        restTodoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(todo.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].priority").value(hasItem(DEFAULT_PRIORITY.toString())))
            .andExpect(jsonPath("$.[*].dueDate").value(hasItem(DEFAULT_DUE_DATE.toString())))
            .andExpect(jsonPath("$.[*].completed").value(hasItem(DEFAULT_COMPLETED)));
    }

    @Test
    @Transactional
    void getTodo() throws Exception {
        // Initialize the database
        insertedTodo = todoRepository.saveAndFlush(todo);

        // Get the todo
        restTodoMockMvc
            .perform(get(ENTITY_API_URL_ID, todo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(todo.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.priority").value(DEFAULT_PRIORITY.toString()))
            .andExpect(jsonPath("$.dueDate").value(DEFAULT_DUE_DATE.toString()))
            .andExpect(jsonPath("$.completed").value(DEFAULT_COMPLETED));
    }

    @Test
    @Transactional
    void getTodosByIdFiltering() throws Exception {
        // Initialize the database
        insertedTodo = todoRepository.saveAndFlush(todo);

        Long id = todo.getId();

        defaultTodoFiltering("id.equals=" + id, "id.notEquals=" + id);

        defaultTodoFiltering("id.greaterThanOrEqual=" + id, "id.greaterThan=" + id);

        defaultTodoFiltering("id.lessThanOrEqual=" + id, "id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllTodosByTitleIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedTodo = todoRepository.saveAndFlush(todo);

        // Get all the todoList where title equals to
        defaultTodoFiltering("title.equals=" + DEFAULT_TITLE, "title.equals=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllTodosByTitleIsInShouldWork() throws Exception {
        // Initialize the database
        insertedTodo = todoRepository.saveAndFlush(todo);

        // Get all the todoList where title in
        defaultTodoFiltering("title.in=" + DEFAULT_TITLE + "," + UPDATED_TITLE, "title.in=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllTodosByTitleIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedTodo = todoRepository.saveAndFlush(todo);

        // Get all the todoList where title is not null
        defaultTodoFiltering("title.specified=true", "title.specified=false");
    }

    @Test
    @Transactional
    void getAllTodosByTitleContainsSomething() throws Exception {
        // Initialize the database
        insertedTodo = todoRepository.saveAndFlush(todo);

        // Get all the todoList where title contains
        defaultTodoFiltering("title.contains=" + DEFAULT_TITLE, "title.contains=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllTodosByTitleNotContainsSomething() throws Exception {
        // Initialize the database
        insertedTodo = todoRepository.saveAndFlush(todo);

        // Get all the todoList where title does not contain
        defaultTodoFiltering("title.doesNotContain=" + UPDATED_TITLE, "title.doesNotContain=" + DEFAULT_TITLE);
    }

    @Test
    @Transactional
    void getAllTodosByStatusIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedTodo = todoRepository.saveAndFlush(todo);

        // Get all the todoList where status equals to
        defaultTodoFiltering("status.equals=" + DEFAULT_STATUS, "status.equals=" + UPDATED_STATUS);
    }

    @Test
    @Transactional
    void getAllTodosByStatusIsInShouldWork() throws Exception {
        // Initialize the database
        insertedTodo = todoRepository.saveAndFlush(todo);

        // Get all the todoList where status in
        defaultTodoFiltering("status.in=" + DEFAULT_STATUS + "," + UPDATED_STATUS, "status.in=" + UPDATED_STATUS);
    }

    @Test
    @Transactional
    void getAllTodosByStatusIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedTodo = todoRepository.saveAndFlush(todo);

        // Get all the todoList where status is not null
        defaultTodoFiltering("status.specified=true", "status.specified=false");
    }

    @Test
    @Transactional
    void getAllTodosByPriorityIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedTodo = todoRepository.saveAndFlush(todo);

        // Get all the todoList where priority equals to
        defaultTodoFiltering("priority.equals=" + DEFAULT_PRIORITY, "priority.equals=" + UPDATED_PRIORITY);
    }

    @Test
    @Transactional
    void getAllTodosByPriorityIsInShouldWork() throws Exception {
        // Initialize the database
        insertedTodo = todoRepository.saveAndFlush(todo);

        // Get all the todoList where priority in
        defaultTodoFiltering("priority.in=" + DEFAULT_PRIORITY + "," + UPDATED_PRIORITY, "priority.in=" + UPDATED_PRIORITY);
    }

    @Test
    @Transactional
    void getAllTodosByPriorityIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedTodo = todoRepository.saveAndFlush(todo);

        // Get all the todoList where priority is not null
        defaultTodoFiltering("priority.specified=true", "priority.specified=false");
    }

    @Test
    @Transactional
    void getAllTodosByDueDateIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedTodo = todoRepository.saveAndFlush(todo);

        // Get all the todoList where dueDate equals to
        defaultTodoFiltering("dueDate.equals=" + DEFAULT_DUE_DATE, "dueDate.equals=" + UPDATED_DUE_DATE);
    }

    @Test
    @Transactional
    void getAllTodosByDueDateIsInShouldWork() throws Exception {
        // Initialize the database
        insertedTodo = todoRepository.saveAndFlush(todo);

        // Get all the todoList where dueDate in
        defaultTodoFiltering("dueDate.in=" + DEFAULT_DUE_DATE + "," + UPDATED_DUE_DATE, "dueDate.in=" + UPDATED_DUE_DATE);
    }

    @Test
    @Transactional
    void getAllTodosByDueDateIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedTodo = todoRepository.saveAndFlush(todo);

        // Get all the todoList where dueDate is not null
        defaultTodoFiltering("dueDate.specified=true", "dueDate.specified=false");
    }

    @Test
    @Transactional
    void getAllTodosByCompletedIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedTodo = todoRepository.saveAndFlush(todo);

        // Get all the todoList where completed equals to
        defaultTodoFiltering("completed.equals=" + DEFAULT_COMPLETED, "completed.equals=" + UPDATED_COMPLETED);
    }

    @Test
    @Transactional
    void getAllTodosByCompletedIsInShouldWork() throws Exception {
        // Initialize the database
        insertedTodo = todoRepository.saveAndFlush(todo);

        // Get all the todoList where completed in
        defaultTodoFiltering("completed.in=" + DEFAULT_COMPLETED + "," + UPDATED_COMPLETED, "completed.in=" + UPDATED_COMPLETED);
    }

    @Test
    @Transactional
    void getAllTodosByCompletedIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedTodo = todoRepository.saveAndFlush(todo);

        // Get all the todoList where completed is not null
        defaultTodoFiltering("completed.specified=true", "completed.specified=false");
    }

    private void defaultTodoFiltering(String shouldBeFound, String shouldNotBeFound) throws Exception {
        defaultTodoShouldBeFound(shouldBeFound);
        defaultTodoShouldNotBeFound(shouldNotBeFound);
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultTodoShouldBeFound(String filter) throws Exception {
        restTodoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(todo.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].priority").value(hasItem(DEFAULT_PRIORITY.toString())))
            .andExpect(jsonPath("$.[*].dueDate").value(hasItem(DEFAULT_DUE_DATE.toString())))
            .andExpect(jsonPath("$.[*].completed").value(hasItem(DEFAULT_COMPLETED)));

        // Check, that the count call also returns 1
        restTodoMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultTodoShouldNotBeFound(String filter) throws Exception {
        restTodoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restTodoMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingTodo() throws Exception {
        // Get the todo
        restTodoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTodo() throws Exception {
        // Initialize the database
        insertedTodo = todoRepository.saveAndFlush(todo);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the todo
        Todo updatedTodo = todoRepository.findById(todo.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTodo are not directly saved in db
        em.detach(updatedTodo);
        updatedTodo
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .status(UPDATED_STATUS)
            .priority(UPDATED_PRIORITY)
            .dueDate(UPDATED_DUE_DATE)
            .completed(UPDATED_COMPLETED);
        TodoDTO todoDTO = todoMapper.toDto(updatedTodo);

        restTodoMockMvc
            .perform(put(ENTITY_API_URL_ID, todoDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(todoDTO)))
            .andExpect(status().isOk());

        // Validate the Todo in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedTodoToMatchAllProperties(updatedTodo);
    }

    @Test
    @Transactional
    void putNonExistingTodo() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        todo.setId(longCount.incrementAndGet());

        // Create the Todo
        TodoDTO todoDTO = todoMapper.toDto(todo);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTodoMockMvc
            .perform(put(ENTITY_API_URL_ID, todoDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(todoDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Todo in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTodo() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        todo.setId(longCount.incrementAndGet());

        // Create the Todo
        TodoDTO todoDTO = todoMapper.toDto(todo);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(todoDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Todo in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTodo() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        todo.setId(longCount.incrementAndGet());

        // Create the Todo
        TodoDTO todoDTO = todoMapper.toDto(todo);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(todoDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Todo in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTodoWithPatch() throws Exception {
        // Initialize the database
        insertedTodo = todoRepository.saveAndFlush(todo);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the todo using partial update
        Todo partialUpdatedTodo = new Todo();
        partialUpdatedTodo.setId(todo.getId());

        partialUpdatedTodo.description(UPDATED_DESCRIPTION).status(UPDATED_STATUS).dueDate(UPDATED_DUE_DATE).completed(UPDATED_COMPLETED);

        restTodoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTodo.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTodo))
            )
            .andExpect(status().isOk());

        // Validate the Todo in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTodoUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedTodo, todo), getPersistedTodo(todo));
    }

    @Test
    @Transactional
    void fullUpdateTodoWithPatch() throws Exception {
        // Initialize the database
        insertedTodo = todoRepository.saveAndFlush(todo);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the todo using partial update
        Todo partialUpdatedTodo = new Todo();
        partialUpdatedTodo.setId(todo.getId());

        partialUpdatedTodo
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .status(UPDATED_STATUS)
            .priority(UPDATED_PRIORITY)
            .dueDate(UPDATED_DUE_DATE)
            .completed(UPDATED_COMPLETED);

        restTodoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTodo.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTodo))
            )
            .andExpect(status().isOk());

        // Validate the Todo in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTodoUpdatableFieldsEquals(partialUpdatedTodo, getPersistedTodo(partialUpdatedTodo));
    }

    @Test
    @Transactional
    void patchNonExistingTodo() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        todo.setId(longCount.incrementAndGet());

        // Create the Todo
        TodoDTO todoDTO = todoMapper.toDto(todo);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTodoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, todoDTO.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(todoDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Todo in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTodo() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        todo.setId(longCount.incrementAndGet());

        // Create the Todo
        TodoDTO todoDTO = todoMapper.toDto(todo);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(todoDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Todo in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTodo() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        todo.setId(longCount.incrementAndGet());

        // Create the Todo
        TodoDTO todoDTO = todoMapper.toDto(todo);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(todoDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Todo in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTodo() throws Exception {
        // Initialize the database
        insertedTodo = todoRepository.saveAndFlush(todo);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the todo
        restTodoMockMvc
            .perform(delete(ENTITY_API_URL_ID, todo.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return todoRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Todo getPersistedTodo(Todo todo) {
        return todoRepository.findById(todo.getId()).orElseThrow();
    }

    protected void assertPersistedTodoToMatchAllProperties(Todo expectedTodo) {
        assertTodoAllPropertiesEquals(expectedTodo, getPersistedTodo(expectedTodo));
    }

    protected void assertPersistedTodoToMatchUpdatableProperties(Todo expectedTodo) {
        assertTodoAllUpdatablePropertiesEquals(expectedTodo, getPersistedTodo(expectedTodo));
    }
}
