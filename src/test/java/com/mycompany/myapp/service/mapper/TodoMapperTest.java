package com.mycompany.myapp.service.mapper;

import static com.mycompany.myapp.domain.TodoAsserts.*;
import static com.mycompany.myapp.domain.TodoTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class TodoMapperTest {

    private TodoMapper todoMapper;

    @BeforeEach
    void setUp() {
        todoMapper = new TodoMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getTodoSample1();
        var actual = todoMapper.toEntity(todoMapper.toDto(expected));
        assertTodoAllPropertiesEquals(expected, actual);
    }
}
