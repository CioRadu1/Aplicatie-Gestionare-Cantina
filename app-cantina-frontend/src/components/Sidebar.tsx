import { Settings, ChefHat, Package, Calendar, Archive } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

const Sidebar = ({activePage, onPageChange} : SidebarProps) => {

  const menuItems = [
    { name: 'Retete', icon: ChefHat },
    { name: 'Materii Prime', icon: Package },
    { name: 'Meniul Zilei', icon: Calendar },
    { name: 'Intrari Magazie', icon: Archive }
    
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Top Section - Icon and Title */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col items-center text-center">
            {/* Placeholder icon - you can replace this */}
            <div className="w-30 h-30 flex items-center justify-center mb-3">
              <img src="logo.png" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Cantina UTCN</h1>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activePage === item.name;
              
              return (
                <li key={item.name}>
                  <button
                    onClick={() => onPageChange(item.name)}
                    className={`hover:cursor-pointer w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 transform hover:scale-105 hover:shadow-md ${
                      isActive 
                        ? 'bg-blue-500 text-white shadow-lg' 
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 mr-3 transition-transform duration-200 ${
                      isActive ? 'scale-110' : ''
                    }`} />
                    <span className="font-medium">{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Settings at Bottom */}
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => onPageChange('Export')}
            className={`hover:cursor-pointer w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 transform hover:scale-105 hover:shadow-md ${
              activePage === 'Export'
                ? 'bg-gray-500 text-white shadow-lg'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            <Settings className={`w-5 h-5 mr-3 transition-transform duration-200 ${
              activePage === 'Export' ? 'rotate-180 scale-110' : 'hover:rotate-90'
            }`} />
            <span className="font-medium">Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;