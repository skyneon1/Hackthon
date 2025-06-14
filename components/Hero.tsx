import Link from 'next/link';

export default function Hero() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        Your Health Assistant
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600">
        Get accurate information about health issues, big and small. Available 24/7.
      </p>
      
      <div className="flex gap-4 mt-8">
        <Link href="/chat-docs">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center shadow-md hover:shadow-lg"
          >
            <span>Chat via Docs</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
            </svg>
          </button>
        </Link>
        <Link href="/chat-images">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center shadow-md hover:shadow-lg"
          >
            <span>Chat via Images</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
} 