import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/queryClient';
import { TodoList } from './components/TodoList';
import { ClipboardList } from 'lucide-react';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ClipboardList className="w-8 h-8 text-blue-500" />
              <h1 className="text-3xl font-bold text-gray-800">Todo App</h1>
            </div>
            <p className="text-gray-600">Keep track of your tasks</p>
          </div>
          <TodoList />
        </div>
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;