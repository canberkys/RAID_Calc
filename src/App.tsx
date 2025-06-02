import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import Calculator from './components/Calculator';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-900 transition-colors duration-200">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-white dark:bg-navy-800 shadow-soft hover:bg-slate-100 dark:hover:bg-navy-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-navy-700" />
            )}
          </button>
        </div>
        <Calculator />
      </main>
      <Footer />
    </div>
  );
}

export default App;