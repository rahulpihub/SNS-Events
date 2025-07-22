import { useEffect, useState } from 'react';

const TestBackend = () => {
  const [message, setMessage] = useState<string>('Loading...');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/test/')
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage('Error connecting to backend.'));
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-2xl shadow-lg text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Backend Test
        </h1>
        <p
          className={`text-lg font-medium ${
            message.includes('Error') ? 'text-red-500' : 'text-green-600'
          }`}
        >
          {message}
        </p>
      </div>
    </div>
  );
};

export default TestBackend;
