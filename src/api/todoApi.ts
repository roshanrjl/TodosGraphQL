import { Todo } from '../types/todo';

const API_URL = 'http://localhost:4000/graphql';

async function graphqlRequest(query: string, variables = {}) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  const { data, errors } = await response.json();
  if (errors) throw new Error(errors[0].message);
  return data;
}

export async function fetchTodos(): Promise<Todo[]> {
  const query = `
    query GetTodos {
      todos {
        id
        text
        completed
      }
    }
  `;
  const data = await graphqlRequest(query);
  return data.todos;
}

export async function addTodo(text: string): Promise<Todo> {
  const mutation = `
    mutation AddTodo($text: String!) {
      addTodo(text: $text) {
        id
        text
        completed
      }
    }
  `;
  const data = await graphqlRequest(mutation, { text });
  return data.addTodo;
}

export async function toggleTodo(id: string): Promise<Todo> {
  const mutation = `
    mutation ToggleTodo($id: ID!) {
      toggleTodo(id: $id) {
        id
        completed
      }
    }
  `;
  const data = await graphqlRequest(mutation, { id });
  return data.toggleTodo;
}

export async function deleteTodo(id: string): Promise<string> {
  const mutation = `
    mutation DeleteTodo($id: ID!) {
      deleteTodo(id: $id)
    }
  `;
  const data = await graphqlRequest(mutation, { id });
  return data.deleteTodo;
}