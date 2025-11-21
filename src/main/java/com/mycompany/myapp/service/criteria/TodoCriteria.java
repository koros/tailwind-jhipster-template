package com.mycompany.myapp.service.criteria;

import com.mycompany.myapp.domain.enumeration.Priority;
import com.mycompany.myapp.domain.enumeration.TodoStatus;
import java.io.Serializable;
import java.util.Objects;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link com.mycompany.myapp.domain.Todo} entity. This class is used
 * in {@link com.mycompany.myapp.web.rest.TodoResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /todos?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TodoCriteria implements Serializable, Criteria {

    /**
     * Class for filtering TodoStatus
     */
    public static class TodoStatusFilter extends Filter<TodoStatus> {

        public TodoStatusFilter() {}

        public TodoStatusFilter(TodoStatusFilter filter) {
            super(filter);
        }

        @Override
        public TodoStatusFilter copy() {
            return new TodoStatusFilter(this);
        }
    }

    /**
     * Class for filtering Priority
     */
    public static class PriorityFilter extends Filter<Priority> {

        public PriorityFilter() {}

        public PriorityFilter(PriorityFilter filter) {
            super(filter);
        }

        @Override
        public PriorityFilter copy() {
            return new PriorityFilter(this);
        }
    }

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter title;

    private TodoStatusFilter status;

    private PriorityFilter priority;

    private InstantFilter dueDate;

    private BooleanFilter completed;

    private Boolean distinct;

    public TodoCriteria() {}

    public TodoCriteria(TodoCriteria other) {
        this.id = other.optionalId().map(LongFilter::copy).orElse(null);
        this.title = other.optionalTitle().map(StringFilter::copy).orElse(null);
        this.status = other.optionalStatus().map(TodoStatusFilter::copy).orElse(null);
        this.priority = other.optionalPriority().map(PriorityFilter::copy).orElse(null);
        this.dueDate = other.optionalDueDate().map(InstantFilter::copy).orElse(null);
        this.completed = other.optionalCompleted().map(BooleanFilter::copy).orElse(null);
        this.distinct = other.distinct;
    }

    @Override
    public TodoCriteria copy() {
        return new TodoCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public Optional<LongFilter> optionalId() {
        return Optional.ofNullable(id);
    }

    public LongFilter id() {
        if (id == null) {
            setId(new LongFilter());
        }
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getTitle() {
        return title;
    }

    public Optional<StringFilter> optionalTitle() {
        return Optional.ofNullable(title);
    }

    public StringFilter title() {
        if (title == null) {
            setTitle(new StringFilter());
        }
        return title;
    }

    public void setTitle(StringFilter title) {
        this.title = title;
    }

    public TodoStatusFilter getStatus() {
        return status;
    }

    public Optional<TodoStatusFilter> optionalStatus() {
        return Optional.ofNullable(status);
    }

    public TodoStatusFilter status() {
        if (status == null) {
            setStatus(new TodoStatusFilter());
        }
        return status;
    }

    public void setStatus(TodoStatusFilter status) {
        this.status = status;
    }

    public PriorityFilter getPriority() {
        return priority;
    }

    public Optional<PriorityFilter> optionalPriority() {
        return Optional.ofNullable(priority);
    }

    public PriorityFilter priority() {
        if (priority == null) {
            setPriority(new PriorityFilter());
        }
        return priority;
    }

    public void setPriority(PriorityFilter priority) {
        this.priority = priority;
    }

    public InstantFilter getDueDate() {
        return dueDate;
    }

    public Optional<InstantFilter> optionalDueDate() {
        return Optional.ofNullable(dueDate);
    }

    public InstantFilter dueDate() {
        if (dueDate == null) {
            setDueDate(new InstantFilter());
        }
        return dueDate;
    }

    public void setDueDate(InstantFilter dueDate) {
        this.dueDate = dueDate;
    }

    public BooleanFilter getCompleted() {
        return completed;
    }

    public Optional<BooleanFilter> optionalCompleted() {
        return Optional.ofNullable(completed);
    }

    public BooleanFilter completed() {
        if (completed == null) {
            setCompleted(new BooleanFilter());
        }
        return completed;
    }

    public void setCompleted(BooleanFilter completed) {
        this.completed = completed;
    }

    public Boolean getDistinct() {
        return distinct;
    }

    public Optional<Boolean> optionalDistinct() {
        return Optional.ofNullable(distinct);
    }

    public Boolean distinct() {
        if (distinct == null) {
            setDistinct(true);
        }
        return distinct;
    }

    public void setDistinct(Boolean distinct) {
        this.distinct = distinct;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final TodoCriteria that = (TodoCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(title, that.title) &&
            Objects.equals(status, that.status) &&
            Objects.equals(priority, that.priority) &&
            Objects.equals(dueDate, that.dueDate) &&
            Objects.equals(completed, that.completed) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, status, priority, dueDate, completed, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TodoCriteria{" +
            optionalId().map(f -> "id=" + f + ", ").orElse("") +
            optionalTitle().map(f -> "title=" + f + ", ").orElse("") +
            optionalStatus().map(f -> "status=" + f + ", ").orElse("") +
            optionalPriority().map(f -> "priority=" + f + ", ").orElse("") +
            optionalDueDate().map(f -> "dueDate=" + f + ", ").orElse("") +
            optionalCompleted().map(f -> "completed=" + f + ", ").orElse("") +
            optionalDistinct().map(f -> "distinct=" + f + ", ").orElse("") +
        "}";
    }
}
