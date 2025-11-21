package com.mycompany.myapp.service.criteria;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Objects;
import java.util.function.BiFunction;
import java.util.function.Function;
import org.assertj.core.api.Condition;
import org.junit.jupiter.api.Test;

class TodoCriteriaTest {

    @Test
    void newTodoCriteriaHasAllFiltersNullTest() {
        var todoCriteria = new TodoCriteria();
        assertThat(todoCriteria).is(criteriaFiltersAre(Objects::isNull));
    }

    @Test
    void todoCriteriaFluentMethodsCreatesFiltersTest() {
        var todoCriteria = new TodoCriteria();

        setAllFilters(todoCriteria);

        assertThat(todoCriteria).is(criteriaFiltersAre(Objects::nonNull));
    }

    @Test
    void todoCriteriaCopyCreatesNullFilterTest() {
        var todoCriteria = new TodoCriteria();
        var copy = todoCriteria.copy();

        assertThat(todoCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(Objects::isNull)),
            criteria -> assertThat(criteria).isEqualTo(todoCriteria)
        );
    }

    @Test
    void todoCriteriaCopyDuplicatesEveryExistingFilterTest() {
        var todoCriteria = new TodoCriteria();
        setAllFilters(todoCriteria);

        var copy = todoCriteria.copy();

        assertThat(todoCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(Objects::nonNull)),
            criteria -> assertThat(criteria).isEqualTo(todoCriteria)
        );
    }

    @Test
    void toStringVerifier() {
        var todoCriteria = new TodoCriteria();

        assertThat(todoCriteria).hasToString("TodoCriteria{}");
    }

    private static void setAllFilters(TodoCriteria todoCriteria) {
        todoCriteria.id();
        todoCriteria.title();
        todoCriteria.status();
        todoCriteria.priority();
        todoCriteria.dueDate();
        todoCriteria.completed();
        todoCriteria.distinct();
    }

    private static Condition<TodoCriteria> criteriaFiltersAre(Function<Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId()) &&
                condition.apply(criteria.getTitle()) &&
                condition.apply(criteria.getStatus()) &&
                condition.apply(criteria.getPriority()) &&
                condition.apply(criteria.getDueDate()) &&
                condition.apply(criteria.getCompleted()) &&
                condition.apply(criteria.getDistinct()),
            "every filter matches"
        );
    }

    private static Condition<TodoCriteria> copyFiltersAre(TodoCriteria copy, BiFunction<Object, Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId(), copy.getId()) &&
                condition.apply(criteria.getTitle(), copy.getTitle()) &&
                condition.apply(criteria.getStatus(), copy.getStatus()) &&
                condition.apply(criteria.getPriority(), copy.getPriority()) &&
                condition.apply(criteria.getDueDate(), copy.getDueDate()) &&
                condition.apply(criteria.getCompleted(), copy.getCompleted()) &&
                condition.apply(criteria.getDistinct(), copy.getDistinct()),
            "every filter matches"
        );
    }
}
