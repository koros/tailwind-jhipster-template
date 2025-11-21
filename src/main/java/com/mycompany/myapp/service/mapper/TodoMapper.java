package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Todo;
import com.mycompany.myapp.service.dto.TodoDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Todo} and its DTO {@link TodoDTO}.
 */
@Mapper(componentModel = "spring")
public interface TodoMapper extends EntityMapper<TodoDTO, Todo> {}
