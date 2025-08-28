import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, X, Search, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

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

interface IntrariMagazie {
    id: {
        codIngredient: string;
        dataAchizitie: string;
    };
    numeIngredient: string;
    cantitate: number;
    cantitateFolosita: number;
    pretAchizitie: number;
    pretTotalCantitateCumparata: number;
    pretTotalCantitateUtilizata: number;
}


const getVisiblePages = (currentPage: number, totalPages: number) => {
    const delta = 2;
    const range = [];
    const rangeWithDots: any = [];

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

const IntrariMagazie = () => {
    const [data, setData] = useState<IntrariMagazie[]>([]);
    const [filteredData, setFilteredData] = useState<IntrariMagazie[]>([]);
    const [materiiPrime, setMateriiPrime] = useState<MateriePrima[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<'add' | 'edit' | 'delete'>('add');
    const [selectedItem, setSelectedItem] = useState<IntrariMagazie | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [allIngredients, setAllIngredients] = useState<MateriePrima[]>([]);


    const [showDropdown, setShowDropdown] = useState(false);
    const [ingredientSearch, setIngredientSearch] = useState('');
    const [selectedMateriePrima, setSelectedMateriePrima] = useState<MateriePrima | null>(null);

    const [formData, setFormData] = useState<Partial<IntrariMagazie>>({
        id: {
            codIngredient: '',
            dataAchizitie: new Date().toISOString().split('T')[0]
        },
        numeIngredient: '',
        cantitate: 0,
        pretAchizitie: 0
    });

    useEffect(() => {
        fetchData();
        fetchIngredienteOptions();
    }, []);

    useEffect(() => {
        const filtered = data.filter(item =>
            item.numeIngredient.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.codIngredient.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.dataAchizitie.includes(searchTerm)
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [data, searchTerm]);

    const openModal = (type: 'add' | 'edit' | 'delete', item?: IntrariMagazie) => {
        setModalType(type);
        setSelectedItem(item || null);
        if (type === 'add') {
            setFormData({
                id: {
                    codIngredient: '',
                    dataAchizitie: new Date().toISOString().split('T')[0]
                },
                numeIngredient: '',
                cantitate: 0,
                pretAchizitie: 0
            });
            setSelectedMateriePrima(null);
            setIngredientSearch('');
        } else if (item) {
            setFormData({ ...item });
            const materie = materiiPrime.find(m => m.codArticol === item.id.codIngredient);
            setSelectedMateriePrima(materie || null);
            setIngredientSearch(item.numeIngredient);
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedItem(null);
        setSelectedMateriePrima(null);
        setIngredientSearch('');
        setShowDropdown(false);
        setFormData({
            id: {
                codIngredient: '',
                dataAchizitie: new Date().toISOString().split('T')[0]
            },
            numeIngredient: '',
            cantitate: 0,
            pretAchizitie: 0
        });
    };
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/intrari-magazie');
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'dataAchizitie') {
            setFormData(prev => ({
                ...prev,
                id: {
                    ...prev.id!,
                    dataAchizitie: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'cantitate' || name === 'pretAchizitie'
                    ? value === '' ? 0 : Number(value)
                    : value
            }));
        }
    }

    const fetchIngredienteOptions = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/materii-prime');
            setAllIngredients(response.data);
            setMateriiPrime(response.data);
        } catch (err) {
            console.error('Error fetching ingredients:', err);
        }
    };
    const handleIngredientSelect = (materie: MateriePrima) => {
        setSelectedMateriePrima(materie);
        setIngredientSearch(materie.denumire);
        setFormData(prev => ({
            ...prev,
            id: {
                ...prev.id!,
                codIngredient: materie.codArticol
            },
            numeIngredient: materie.denumire,
            pretAchizitie: materie.pretMateriePrima
        }));
        setShowDropdown(false);
    };

    const filteredMateriiPrime = allIngredients.filter(materie =>
        materie.denumire.toLowerCase().includes(ingredientSearch.toLowerCase()) ||
        materie.codArticol.toLowerCase().includes(ingredientSearch.toLowerCase())
    );

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
        const submitData: IntrariMagazie = {
            id: {
                codIngredient: formData.id?.codIngredient || '',
                dataAchizitie: formData.id?.dataAchizitie || ''
            },
            numeIngredient: formData.numeIngredient || '',
            cantitate: formData.cantitate || 0,
            cantitateFolosita: formData.cantitateFolosita || 0,
            pretAchizitie: formData.pretAchizitie || 0,
            pretTotalCantitateCumparata: formData.pretTotalCantitateCumparata || 0,
            pretTotalCantitateUtilizata: formData.pretTotalCantitateUtilizata || 0
        };

        try {
            if (modalType === 'add') {
                await axios.post('http://localhost:8080/api/intrari-magazie', submitData);
            } else if (modalType === 'edit' && selectedItem) {
                await axios.put(
                    `http://localhost:8080/api/intrari-magazie/edit-intrare`,
                    submitData,
                    {
                        params: {
                            codIngredient: submitData.id.codIngredient,
                            dataAchizitie: submitData.id.dataAchizitie
                        }
                    }

                );
            } else if (modalType === 'delete' && selectedItem) {
                await axios.delete(
                    `http://localhost:8080/api/intrari-magazie/delete`,
                    {
                        params: {
                            codIngredient: submitData.id.codIngredient,
                            dataAchizitie: submitData.id.dataAchizitie
                        },
                    }

                );
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
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">Intrari Magazie</h1>
                        <button
                            onClick={() => openModal('add')}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                        >
                            <Plus className="w-4 h-4" />
                            Adauga
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="flex items-center space-x-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Cauta dupa numele ingredientului, cod sau data..."
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

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cod Ingredient
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nume Ingredient
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Data Achizitie
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cantitate
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cantitate Folosita
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pret Achizitie
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pret Total Cumparata
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pret Total Utilizata
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actiuni
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((item) => (
                                <tr key={`${item.id.codIngredient}-${item.id.dataAchizitie}`} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {item.id.codIngredient}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {item.numeIngredient}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {new Date(item.id.dataAchizitie).toLocaleDateString('ro-RO')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {item.cantitate}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {item.cantitateFolosita}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {item.pretAchizitie} RON
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {item.pretTotalCantitateCumparata.toFixed(2)} RON
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {item.pretTotalCantitateUtilizata.toFixed(2)} RON
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

                {/* Pagination */}
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
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${page === currentPage
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">
                                {modalType === 'add' ? 'Adauga Intrare Magazie' :
                                    modalType === 'edit' ? 'Modifica Intrare Magazie' :
                                        'Sterge Intrare Magazie'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {modalType === 'delete' ? (
                                <div className="text-center">
                                    <p className="text-gray-700 mb-6">
                                        Esti sigur ca vrei sa stergi intrarea pentru "{selectedItem?.numeIngredient}"?
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
                                            type="button"
                                            onClick={(e) => handleSubmit(e as any)}
                                            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                                        >
                                            Sterge
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {/* Ingredient Selection with Dropdown */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nume Ingredient *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={ingredientSearch}
                                                onChange={(e) => {
                                                    setIngredientSearch(e.target.value);
                                                    setShowDropdown(true);
                                                }}
                                                onFocus={() => setShowDropdown(true)}
                                                placeholder="Cauta si selecteaza ingredient..."
                                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>

                                        {/* Dropdown */}
                                        {showDropdown && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                {filteredMateriiPrime.length > 0 ? (
                                                    filteredMateriiPrime.map((materie) => (
                                                        <div
                                                            key={materie.codArticol}
                                                            onClick={() => handleIngredientSelect(materie)}
                                                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                                        >
                                                            <div className="font-medium text-gray-900">
                                                                {materie.denumire}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                Cod: {materie.codArticol} | Pret: {materie.pretMateriePrima} RON
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-2 text-gray-500 text-center">
                                                        Nu s-au gasit ingrediente
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Date Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Data Achizitie *
                                        </label>
                                        <input
                                            type="date"
                                            name="dataAchizitie"
                                            value={formData.id?.dataAchizitie}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    {/* Quantity Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Cantitate Achizitionata *
                                        </label>
                                        <input
                                            type="number"
                                            name="cantitate"
                                            value={formData.cantitate}
                                            onChange={handleInputChange}
                                            step="0.001"
                                            min="0"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                            onClick={(e) => e.currentTarget.select()}
                                        />
                                    </div>

                                    {/* Price Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Pret Achizitie Materie Prima *
                                        </label>
                                        <input
                                            type="number"
                                            name="pretAchizitie"
                                            value={formData.pretAchizitie}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            min="0"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                            onClick={(e) => e.currentTarget.select()}
                                        />
                                    </div>

                                    {/* Calculated Total */}
                                    {formData.cantitate && formData.pretAchizitie && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="text-sm font-medium text-gray-700">
                                                Pret Total: {((formData.cantitate || 0) * (formData.pretAchizitie || 0)).toFixed(2)} RON
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-end space-x-4 mt-6">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            Anuleaza
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => handleSubmit(e as any)}
                                            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                                            disabled={!selectedMateriePrima && modalType === 'add'}
                                        >
                                            {modalType === 'add' ? 'Adauga' : 'Salveaza'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showDropdown && (
                <div
                    className="fixed inset-0 z-5"
                    onClick={() => setShowDropdown(false)}
                />
            )}
        </div>
    );
};

export default IntrariMagazie;