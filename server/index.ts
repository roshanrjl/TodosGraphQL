import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import cors from "cors";

// Define the Todo type
type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

// In-memory storage for todos
let todos: Todo[] = [];

// GraphQL schema
const schema = buildSchema(`
  type Todo {
    id: ID!
    text: String!
    completed: Boolean!
  }

  type Query {
    todos: [Todo]!
    todo(id: ID!): Todo
  }

  type Mutation {
    addTodo(text: String!): Todo
    toggleTodo(id: ID!): Todo
    deleteTodo(id: ID!): ID
  }
`);

// // Resolvers
// const root = {
//   todos: (): Todo[] => todos,
//   todo: ({ id }: { id: string }): Todo | undefined => todos.find(todo => todo.id === id),
//   addTodo: ({ text }: { text: string }): Todo => {
//     const todo: Todo = {
//       id: String(Date.now()),
//       text,
//       completed: false
//     };
//     todos.push(todo);
//     return todo;
//   },
//   toggleTodo: ({ id }: { id: string }): Todo | undefined => {
//     const todo = todos.find(t => t.id === id);
//     if (todo) {
//       todo.completed = !todo.completed;
//     }
//     return todo;
//   },
//   deleteTodo: ({ id }: { id: string }): string => {
//     todos = todos.filter(t => t.id !== id);
//     return id;
//   }
// };
// Define the GraphQL resolvers interface
interface Resolvers {
  todos: () => Todo[];
  todo: ({ id }: { id: string }) => Todo | undefined;
  addTodo: ({ text }: { text: string }) => Todo;
  toggleTodo: ({ id }: { id: string }) => Todo | undefined;
  deleteTodo: ({ id }: { id: string }) => string;
}

const root: Resolvers = {
  todos: (): Todo[] => todos,
  todo: ({ id }) => todos.find((todo) => todo.id === id),
  addTodo: ({ text }) => {
    const todo: Todo = {
      id: String(Date.now()),
      text,
      completed: false,
    };
    todos.push(todo);
    return todo;
  },
  toggleTodo: ({ id }) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
    return todo;
  },
  deleteTodo: ({ id }) => {
    todos = todos.filter((t) => t.id !== id);
    return id;
  },
};

const app: express.Application = express();
app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/graphql`);
});
