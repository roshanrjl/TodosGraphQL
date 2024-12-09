"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var express_graphql_1 = require("express-graphql");
var graphql_1 = require("graphql");
var cors_1 = require("cors");
// In-memory storage for todos
var todos = [];
// GraphQL schema
var schema = (0, graphql_1.buildSchema)("\n  type Todo {\n    id: ID!\n    text: String!\n    completed: Boolean!\n  }\n\n  type Query {\n    todos: [Todo]!\n    todo(id: ID!): Todo\n  }\n\n  type Mutation {\n    addTodo(text: String!): Todo\n    toggleTodo(id: ID!): Todo\n    deleteTodo(id: ID!): ID\n  }\n");
var root = {
    todos: function () { return todos; },
    todo: function (_a) {
        var id = _a.id;
        return todos.find(function (todo) { return todo.id === id; });
    },
    addTodo: function (_a) {
        var text = _a.text;
        var todo = {
            id: String(Date.now()),
            text: text,
            completed: false,
        };
        todos.push(todo);
        return todo;
    },
    toggleTodo: function (_a) {
        var id = _a.id;
        var todo = todos.find(function (t) { return t.id === id; });
        if (todo) {
            todo.completed = !todo.completed;
        }
        return todo;
    },
    deleteTodo: function (_a) {
        var id = _a.id;
        todos = todos.filter(function (t) { return t.id !== id; });
        return id;
    },
};
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use("/graphql", (0, express_graphql_1.graphqlHTTP)({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
var PORT = 4000;
app.listen(PORT, function () {
    console.log("Server running on http://localhost:".concat(PORT, "/graphql"));
});
