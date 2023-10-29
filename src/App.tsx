import './App.css';
import { useState } from 'react'
import { SideBar } from './components/SideBar/SideBar';
import { Route, Routes } from 'react-router';
import { HomePage } from './pages/Homepage/HomePage';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <div>
        <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="lg:pl-72">
          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">
              <Routes>
                <Route
                  path="/"
                  element={< HomePage />}
                />
              </Routes>

            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
