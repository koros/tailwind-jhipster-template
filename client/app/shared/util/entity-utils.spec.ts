import { cleanEntity, mapIdList, overridePaginationStateWithQueryParams, overrideSortStateWithQueryParams } from './entity-utils';

describe('Entity Utils', () => {
  describe('cleanEntity', () => {
    it('should remove fields with empty id', () => {
      const entity = {
        name: 'Test',
        description: 'Description',
        emptyRelation: { id: '' },
        validRelation: { id: 123 },
      };
      const result = cleanEntity(entity);
      expect(result.emptyRelation).toBeUndefined();
      expect(result.validRelation).toBeDefined();
    });

    it('should remove fields with id = -1', () => {
      const entity = {
        name: 'Test',
        invalidRelation: { id: -1 },
        validRelation: { id: 456 },
      };
      const result = cleanEntity(entity);
      expect(result.invalidRelation).toBeUndefined();
      expect(result.validRelation).toBeDefined();
    });

    it('should keep simple fields', () => {
      const entity = {
        name: 'Test',
        age: 25,
        active: true,
      };
      const result = cleanEntity(entity);
      expect(result.name).toBe('Test');
      expect(result.age).toBe(25);
      expect(result.active).toBe(true);
    });
  });

  describe('mapIdList', () => {
    it('should map id list to object array', () => {
      const idList = [1, 2, 3];
      const result = mapIdList(idList);
      expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });

    it('should filter empty strings', () => {
      const idList = [1, '', 2, '', 3];
      const result = mapIdList(idList);
      expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });

    it('should handle null/undefined', () => {
      expect(mapIdList(null)).toBeUndefined();
      expect(mapIdList(undefined)).toBeUndefined();
    });
  });

  describe('overrideSortStateWithQueryParams', () => {
    it('should override sort and order from query params', () => {
      const state = { sort: 'id', order: 'asc' };
      const result = overrideSortStateWithQueryParams(state, '?sort=name,desc');
      expect(result.sort).toBe('name');
      expect(result.order).toBe('desc');
    });

    it('should return unchanged state if no sort param', () => {
      const state = { sort: 'id', order: 'asc' };
      const result = overrideSortStateWithQueryParams(state, '?page=1');
      expect(result.sort).toBe('id');
      expect(result.order).toBe('asc');
    });
  });

  describe('overridePaginationStateWithQueryParams', () => {
    it('should override pagination and sort from query params', () => {
      const state = { sort: 'id', order: 'asc', activePage: 1 };
      const result = overridePaginationStateWithQueryParams(state, '?page=5&sort=name,desc');
      expect(result.activePage).toBe(5);
      expect(result.sort).toBe('name');
      expect(result.order).toBe('desc');
    });

    it('should handle missing page param', () => {
      const state = { sort: 'id', order: 'asc', activePage: 1 };
      const result = overridePaginationStateWithQueryParams(state, '?sort=name,asc');
      expect(result.activePage).toBe(1);
      expect(result.sort).toBe('name');
    });
  });
});
