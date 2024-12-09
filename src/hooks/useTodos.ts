import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addTodo, deleteTodo, fetchTodos, toggleTodo } from '../api/todoApi';
import { Todo } from '../types/todo';

export function useTodos() {
  const queryClient = useQueryClient();
  
  const { data: todos = [], isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleTodo,
    onSuccess: (updatedTodo) => {
      queryClient.setQueryData(['todos'], (old: Todo[]) =>
        old.map((todo) =>
          todo.id === updatedTodo.id ? { ...todo, completed: updatedTodo.completed } : todo
        )
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: (deletedId) => {
      queryClient.setQueryData(['todos'], (old: Todo[]) =>
        old.filter((todo) => todo.id !== deletedId)
      );
    },
  });

  return {
    todos,
    isLoading,
    error,
    addTodo: addMutation.mutate,
    toggleTodo: toggleMutation.mutate,
    deleteTodo: deleteMutation.mutate,
  };
}