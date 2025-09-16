import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSortField, setSortDirection, selectSortField, selectSortDirection } from '../features/tasks/tasksSlice';

const SortControls = () => {
  const dispatch = useDispatch();
  const currentSortField = useSelector(selectSortField);
  const currentSortDirection = useSelector(selectSortDirection);

  const handleSortFieldChange = (e) => {
    const newSortField = e.target.value;
    dispatch(setSortField(newSortField));
    dispatch(setSortDirection('asc'));
  };

  const handleSortDirectionChange = (e) => {
    const newSortDirection = e.target.value;
    dispatch(setSortDirection(newSortDirection));
  };

  return (
    // Добавлен класс
    <div className="sort-controls"> 
      <div>
        <label htmlFor="sort-field">Sort by:</label>
        <select
          id="sort-field"
          value={currentSortField}
          onChange={handleSortFieldChange}
        >
          <option value="username">Username</option>
          <option value="email">Email</option>
          <option value="isCompleted">Status</option>
        </select>
      </div>

      <div>
        <label htmlFor="sort-direction">Direction:</label>
        <select
          id="sort-direction"
          value={currentSortDirection}
          onChange={handleSortDirectionChange}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
};

export default SortControls;