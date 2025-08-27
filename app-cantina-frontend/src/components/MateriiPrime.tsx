import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, X, Search, ChevronLeft, ChevronRight } from "lucide-react";

interface MateriePrima {
    codArticol: string;
    codMoneda: string;
    denumire: string;
    denumireScurta: string;
    denumireUm: string;
    gestiune: string;
    gestiune1: string;
    um: string;
    tvaVanzare: string;
    pretMateriePrima: number;
    stoculActualTotal: number | null;
}

const getVisiblePages = (currentPage: number, totalPages: number) => {
    const delta = 2;
    const range = [];
    const rangeWithDots:any = [];

    range.push(1);

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
        range.push(i);
    }

    if (totalPages > 1) {
        range.push(totalPages);
    }

    const uniqueRange = [...new Set(range)].sort((a, b) => a - b);

    let prev = 0;
    uniqueRange.forEach((page) => {
        if (page - prev > 1) {
            rangeWithDots.push('...');
        }
        rangeWithDots.push(page);
        prev = page;
    });

    return rangeWithDots;
};

const MateriiPrime = () => {
    const [data, setData] = useState<MateriePrima[]>([]);
    const [filteredData, setFilteredData] = useState<MateriePrima[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<'add' | 'edit' | 'delete'>('add');
    const [selectedItem, setSelectedItem] = useState<MateriePrima | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [formData, setFormData] = useState<MateriePrima>({
        codArticol: '',
        codMoneda: '',
        denumire: '',
        denumireScurta: '',
        denumireUm: '',
        gestiune: '',
        gestiune1: '',
        um: '',
        tvaVanzare: '',
        pretMateriePrima: 0,
        stoculActualTotal: null
    });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = data.filter(item =>
            item.denumire.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.codArticol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.um.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.tvaVanzare.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [data, searchTerm]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/materii-prime');
            setData(response.data);
            setFilteredData(response.data);
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError('Failed to fetch data: ' + errorMessage);
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (type: 'add' | 'edit' | 'delete', item?: MateriePrima) => {
        setModalType(type);
        setSelectedItem(item || null);
        if (type === 'add') {
            setFormData({
                codArticol: '',
                codMoneda: '',
                denumire: '',
                denumireScurta: '',
                denumireUm: '',
                gestiune: '',
                gestiune1: '',
                um: '',
                tvaVanzare: '',
                pretMateriePrima: 0,
                stoculActualTotal: null
            });
        } else if (item) {
            setFormData({ ...item });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedItem(null);
        setFormData({
            codArticol: '',
            codMoneda: '',
            denumire: '',
            denumireScurta: '',
            denumireUm: '',
            gestiune: '',
            gestiune1: '',
            um: '',
            tvaVanzare: '',
            pretMateriePrima: 0,
            stoculActualTotal: null
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'pretMateriePrima' || name === 'stoculActualTotal' 
                ? value === '' ? null : Number(value)
                : value
        }));
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredData.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (modalType === 'add') {
                await axios.post('http://localhost:8080/api/materii-prime', formData);
            } else if (modalType === 'edit') {
                await axios.put(`http://localhost:8080/api/materii-prime/${formData.codArticol}`, formData);
            } else if (modalType === 'delete' && selectedItem) {
                await axios.delete(`http://localhost:8080/api/materii-prime/${selectedItem.codArticol}`);
            }
            await fetchData();
            closeModal();
        } catch (err) {
            console.error('Error performing operation:', err);
            setError('Failed to perform operation');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-red-700">Error: {error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="bg-white rounded-xl shadow-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">Materii Prime</h1>
                        <button
                            onClick={() => openModal('add')}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                        >
                            <Plus className="w-4 h-4" />
                            Adauga
                        </button>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Cauta dupa denumire, cod articol, UM sau TVA..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="text-sm text-gray-500">
                            {filteredData.length} din {data.length} rezultate
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Denumire
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cod Articol
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    UM
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    TVA Vanzare
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pret Materie Prima
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stoc Actual Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actiuni
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((item, index) => (
                                <tr key={item.codArticol || index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {item.denumire}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {item.codArticol}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {item.um}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {item.tvaVanzare}%
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {item.pretMateriePrima} RON
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {item.stoculActualTotal ?? 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => openModal('edit', item)}
                                                className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors duration-200"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => openModal('delete', item)}
                                                className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors duration-200"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {filteredData.length === 0 && !loading && (
                        <div className="text-center py-8 text-gray-500">
                            {searchTerm ? 'Nu au fost gasite rezultate pentru cautarea ta' : 'Nu sunt date disponibile'}
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                            <span>
                                Afiseaza {startIndex + 1}-{Math.min(endIndex, filteredData.length)} din {filteredData.length} rezultate
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            
                            {getVisiblePages(currentPage, totalPages).map((page: any, index: any) => {
                                if (page === '...') {
                                    return (
                                        <span
                                            key={`ellipsis-${index}`}
                                            className="px-3 py-2 text-gray-500 select-none"
                                        >
                                            ...
                                        </span>
                                    );
                                }

                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page as number)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                            page === currentPage
                                                ? 'bg-blue-500 text-white'
                                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                            
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">
                                {modalType === 'add' ? 'Adauga Materie Prima' : 
                                 modalType === 'edit' ? 'Modifica Materie Prima' : 
                                 'Sterge Materie Prima'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            {modalType === 'delete' ? (
                                <div className="text-center">
                                    <p className="text-gray-700 mb-6">
                                        Esti sigur ca vrei sa stergi materia prima "{selectedItem?.denumire}"?
                                    </p>
                                    <div className="flex justify-center space-x-4">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            Anuleaza
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                                        >
                                            Sterge
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Cod Articol
                                        </label>
                                        <input
                                            type="text"
                                            name="codArticol"
                                            value={formData.codArticol}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Cod Moneda
                                        </label>
                                        <input
                                            type="text"
                                            name="codMoneda"
                                            value={formData.codMoneda}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Denumire
                                        </label>
                                        <input
                                            type="text"
                                            name="denumire"
                                            value={formData.denumire}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Denumire Scurta
                                        </label>
                                        <input
                                            type="text"
                                            name="denumireScurta"
                                            value={formData.denumireScurta}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Denumire UM
                                        </label>
                                        <input
                                            type="text"
                                            name="denumireUm"
                                            value={formData.denumireUm}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Gestiune
                                        </label>
                                        <input
                                            type="text"
                                            name="gestiune"
                                            value={formData.gestiune}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Gestiune 1
                                        </label>
                                        <input
                                            type="text"
                                            name="gestiune1"
                                            value={formData.gestiune1}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            UM
                                        </label>
                                        <input
                                            type="text"
                                            name="um"
                                            value={formData.um}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            TVA Vanzare (%)
                                        </label>
                                        <input
                                            type="text"
                                            name="tvaVanzare"
                                            value={formData.tvaVanzare}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="md:col-span-2 flex justify-end space-x-4 mt-6">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            Anuleaza
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                                        >
                                            {modalType === 'add' ? 'Adauga' : 'Salveaza'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MateriiPrime;