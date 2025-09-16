import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPage, selectCurrentPage, selectTotalTasks, selectPageSize, fetchTasks } from '../features/tasks/tasksSlice';

const Pagination = () => {
  const dispatch = useDispatch();
  const currentPage = useSelector(selectCurrentPage);
  const totalTasks = useSelector(selectTotalTasks);
  const pageSize = useSelector(selectPageSize);

  const totalPages = Math.ceil(totalTasks / pageSize);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setPage(newPage));
      dispatch(fetchTasks({ page: newPage }));
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    // Добавлен класс
    <div className="pagination-controls"> 
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      <span>
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;