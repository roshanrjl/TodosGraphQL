import React from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Trash2, CheckCircle, Circle } from "lucide-react";

const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      text
      completed
    }
  }
`;

const ADD_TODO = gql`
  mutation AddTodo($text: String!) {
    addTodo(text: $text) {
      id
      text
      completed
    }
  }
`;

const TOGGLE_TODO = gql`
  mutation ToggleTodo($id: ID!) {
    toggleTodo(id: $id) {
      id
      completed
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;

export function TodoList() {
  const [newTodo, setNewTodo] = React.useState("");
  const { loading, error, data } = useQuery(GET_TODOS);
  const [addTodo] = useMutation(ADD_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });
  const [toggleTodo] = useMutation(TOGGLE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    addTodo({ variables: { text: newTodo.trim() } });
    setNewTodo("");
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>
      </form>

      <ul className="space-y-3">
        {data?.todos.map(
          (todo: { id: string; text: string; completed: boolean }) => (
            <li
              key={todo.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
              onClick={() => toggleTodo({ variables: { id: todo.id } })}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTodo({ variables: { id: todo.id } })}
                  className="text-gray-500 hover:text-blue-500"
                >
                  {todo.completed ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
                <span
                  className={todo.completed ? "line-through text-gray-500" : ""}
                >
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => deleteTodo({ variables: { id: todo.id } })}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
