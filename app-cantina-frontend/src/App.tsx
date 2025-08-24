import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Retete from './components/Retete';
import MateriiPrime from './components/MateriiPrime';
import MeniuZilei from './components/MeniuZilei';
import IntrariMagazie from './components/IntrariMagazie';
import Setari from './components/Setari';


// Main App Component
const App = () => {
  const [activePage, setActivePage] = useState<string>('Retete');

  // Function to handle page changes from sidebar
  const handlePageChange = (pageName: string) => {
    setActivePage(pageName);
  };

  // Function to render the appropriate page component
  const renderPage = () => {
    switch (activePage) {
      case 'Retete':
        return <Retete />;
      case 'Materii Prime':
        return <MateriiPrime />;
      case 'Meniul Zilei':
        return <MeniuZilei />;
      case 'Intrari Magazie':
        return <IntrariMagazie />;
      case 'Setari':
        return <Setari />;
      default:
        return <Retete />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar activePage={activePage} onPageChange={handlePageChange} />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {renderPage()}
      </div>
    </div>
  );
};

export default App;