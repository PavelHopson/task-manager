import prisma from '../prisma/client.js';

// @desc    Get all tasks with pagination and sorting
// @route   GET /api/tasks
// @access  Public
const getTasks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Номер страницы (по умолчанию 1)
        const pageSize = 3; // Размер страницы по ТЗ

        // Поля, по которым разрешена сортировка
        const validSortFields = ['username', 'email', 'isCompleted'];
        // Направления сортировки
        const validSortDirections = ['asc', 'desc'];

        // Получаем параметры сортировки из запроса
        let sortField = req.query.sort_field || 'createdAt'; // По умолчанию сортируем по дате создания
        let sortDirection = req.query.sort_dir || 'desc'; // По умолчанию по убыванию

        // Валидация поля сортировки
        if (!validSortFields.includes(sortField)) {
             sortField = 'createdAt'; // Сбрасываем на дефолт, если некорректно
        }
        // Валидация направления сортировки
         if (!validSortDirections.includes(sortDirection)) {
             sortDirection = 'desc'; // Сбрасываем на дефолт, если некорректно
         }

        // Вычисляем offset для пагинации
        const skip = (page - 1) * pageSize;

        // Запрашиваем задачи из БД с учетом пагинации и сортировки
        const tasks = await prisma.task.findMany({
            skip: skip,
            take: pageSize,
            orderBy: {
                [sortField]: sortDirection // Динамическая сортировка
            }
        });

        // Получаем общее количество задач для расчета количества страниц
        const totalTasks = await prisma.task.count();

        res.status(200).json({
            success: true,
            data: {
                items: tasks,
                total: totalTasks,
                page: page,
                pageSize: pageSize
            }
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};


// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public
const createTask = async (req, res) => {
    try {
        const { username, email, text } = req.body;

        // Базовая валидация (можно расширить с помощью express-validator позже)
        if (!username || !email || !text) {
            return res.status(400).json({
                success: false,
                error: 'Username, email, and text are required.'
            });
        }

        // Простая валидация email (можно улучшить регулярным выражением)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
             return res.status(400).json({
                success: false,
                error: 'Please provide a valid email address.'
            });
        }

        // Создаем задачу в БД
        const newTask = await prisma.task.create({
            data: {
                username,
                email,
                text
            }
        });

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: newTask
        });

    } catch (error) {
        console.error("Error creating task:", error);
         // Обработка ошибок Prisma, например, уникальность email (если бы она была)
         if (error.code === 'P2002') { // Unique constraint failed
            return res.status(400).json({
                 success: false,
                 error: 'A task with this email might already exist.' // Или другая логика
             });
         }
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Update a task (Admin only)
// @route   PUT /api/tasks/:id
// @access  Private/Admin
const updateTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid task ID.'
      });
    }

    const { text, isCompleted } = req.body;

    // Проверяем, есть ли что обновлять
    // Изменим логику: разрешаем обновление, даже если поля undefined, но хотя бы одно передано
    if (text === undefined && isCompleted === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Text or isCompleted field is required for update.'
      });
    }

    // --- НОВАЯ ЛОГИКА ---
    // 1. Получаем оригинальную задачу из БД
    const originalTask = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!originalTask) {
      return res.status(404).json({
        success: false,
        error: 'Task not found.'
      });
    }

    // 2. Подготавливаем данные для обновления
    const updateData = {};
    if (text !== undefined) updateData.text = text;
    if (isCompleted !== undefined) updateData.isCompleted = isCompleted;

    // 3. Проверяем, изменился ли текст, и если да, устанавливаем isAdminEdited
    //    (Только если текст действительно изменился)
    if (text !== undefined && text !== originalTask.text) {
      updateData.isAdminEdited = true;
    }
    // --- КОНЕЦ НОВОЙ ЛОГИКИ ---

    // Обновляем задачу в БД
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData // Передаем подготовленные данные
    });

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      updatedTask: updatedTask // Возвращаем обновленную задачу
    });

  } catch (error) {
    console.error("Error updating task:", error);
    // if (error.code === 'P2025') { // Этот блок может быть не нужен, так как мы проверяем существование выше
    //   return res.status(404).json({
    //     success: false,
    //     error: 'Task not found.'
    //   });
    // }
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};


export { getTasks, createTask, updateTask };