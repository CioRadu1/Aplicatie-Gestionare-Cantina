import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Retete from './components/Retete';
import MateriiPrime from './components/MateriiPrime';
import MeniuZilei from './components/MeniuZilei';
import IntrariMagazie from './components/IntrariMagazie';
import Export from './components/Export';


const App = () => {
  const [activePage, setActivePage] = useState<string>('Retete');

  const handlePageChange = (pageName: string) => {
    setActivePage(pageName);
  };

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
      case 'Export':
        return <Export />;
      default:
        return <Retete />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage={activePage} onPageChange={handlePageChange} />

      <div className="flex-1 overflow-y-auto">
        {renderPage()}
      </div>
    </div>
  );
};

export default App;