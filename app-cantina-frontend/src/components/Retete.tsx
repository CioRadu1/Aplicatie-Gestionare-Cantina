import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, X, Search, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Minus } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

interface ExecutieReteta {
    codArticol: string;
    portii: number;
    um: string;
    totalPortii: number;
    statusReteta: number;
    dataUltimaModificare: string;
    utilizator: string | null;
    gramajPerPortie: number;
    numeReteta: string;
    localId?: string;
}

interface IntraresMagazie {
    id: {
        codIngredient: string;
        dataAchizitie: string;
    }
    numeIngredient: string;
    cantitate: number;
    cantitateFolosita: number;
    pretAchizitie: number;
}

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

interface RetetaIngredient {
    id: {
        codReteta: string;
        codIngredient: string;
    };
    cantitate: number;
    um: string;
    necesar: number;
    numeReteta: string;
    numeMateriePrima: string;
    localId?: string;
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

const useDebounce = (value: any, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const Retete = () => {
    const [data, setData] = useState<ExecutieReteta[]>([]);
    const [filteredData, setFilteredData] = useState<ExecutieReteta[]>([]);
    const [ingredients, setIngredients] = useState<{ [key: string]: RetetaIngredient[] }>({});
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<'add' | 'edit' | 'delete' | 'ingredient'>('add');
    const [selectedItem, setSelectedItem] = useState<ExecutieReteta | null>(null);
    const [selectedIngredient, setSelectedIngredient] = useState<RetetaIngredient | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [umOptions, setUmOptions] = useState<string[]>([]);
    const [denumireUmOptions, setDenumireUmOptions] = useState<string[]>([]);
    const [allIngredients, setAllIngredients] = useState<MateriePrima[]>([]);
    const [ingredientSearch, setIngredientSearch] = useState('');
    const [filteredIngredients, setFilteredIngredients] = useState<MateriePrima[]>([]);
    const [ingredientToDelete, setIngredientToDelete] = useState<RetetaIngredient | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showInventoryModal, setShowInventoryModal] = useState(false);
    const [inventoryWarnings, setInventoryWarnings] = useState<{ ingredient: string, needed: number, available: number }[]>([]);

    const [localPortiiValues, setLocalPortiiValues] = useState<{ [key: string]: string }>({});
    const [localIngredientValues, setLocalIngredientValues] = useState<{ [key: string]: string }>({});

    const confirmDeleteIngredient = (ingredient: RetetaIngredient) => {
        setIngredientToDelete(ingredient);
        setShowDeleteModal(true);
    };

    const [formData, setFormData] = useState<ExecutieReteta>({
        codArticol: '',
        portii: 0,
        um: 'PORTIE',
        totalPortii: 0,
        statusReteta: 1,
        dataUltimaModificare: new Date().toISOString().split('T')[0],
        utilizator: null,
        gramajPerPortie: 0,
        numeReteta: ''
    });
    const [ingredientFormData, setIngredientFormData] = useState<RetetaIngredient>({
        id: {
            codReteta: '',
            codIngredient: ''
        },
        cantitate: 0,
        um: 'KILOGRAM',
        necesar: 0,
        numeReteta: '',
        numeMateriePrima: ''
    });

    const debouncedPortiiValues = useDebounce(localPortiiValues, 300);
    const debouncedIngredientValues = useDebounce(localIngredientValues, 700);

    const fetchUmOptions = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/executii-retete/um-options');
            setUmOptions(response.data);
        } catch (err) {
            console.error('Error fetching UM options:', err);
        }
    };
    const fetchIngredienteOptions = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/materii-prime');
            setAllIngredients(response.data);
            setFilteredIngredients(response.data);
        } catch (err) {
            console.error('Error fetching UM options:', err);
        }
    };
    const fetchDenumireUmOptions = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/retete/denumireUm-distinct');
            setDenumireUmOptions(response.data);
        } catch (err) {
            console.error('Error fetching UM options:', err);
        }
    };

    useEffect(() => {
        fetchData();
        fetchUmOptions();
        fetchDenumireUmOptions();
        fetchIngredienteOptions();
    }, []);

    useEffect(() => {
        const filtered = allIngredients.filter((ing) =>
            ing.denumire.toLowerCase().includes(ingredientSearch.toLowerCase())
        );
        setFilteredIngredients(filtered);
    }, [ingredientSearch, allIngredients]
    );

    useEffect(() => {
        const filtered = data.filter(item =>
            item.numeReteta.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.codArticol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.um.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [data, searchTerm]);

    useEffect(() => {
        Object.entries(debouncedPortiiValues).forEach(([codArticol, value]: any) => {
            const numValue = value === '' ? 0 : parseInt(value);
            if (!isNaN(numValue) && numValue >= 0) {
                const currentItem = data.find(item => item.codArticol === codArticol);
                if (currentItem && currentItem.totalPortii !== numValue) {
                    updateTotalPortii(codArticol, numValue);
                }
            }
        });
    }, [debouncedPortiiValues, data]);

    useEffect(() => {
        Object.entries(debouncedIngredientValues).forEach(([key, value]) => {
            const [codReteta, codIngredient] = key.split('|');
            const numValue = value === '' ? 0 : Number(value);
            if (!isNaN(numValue)) {
                const ingredient = ingredients[codReteta]?.find(ing => ing.id.codIngredient === codIngredient);
                if (ingredient && ingredient.necesar !== numValue) {
                    updateIngredient(ingredient, 'necesar', numValue);
                }
            }
        });
    }, [debouncedIngredientValues, ingredients]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/executii-retete');

            const dataWithKeys = response.data.map((item: ExecutieReteta) => ({
                ...item,
                localId: uuidv4(),
            }));

            setData(dataWithKeys);
            setFilteredData(dataWithKeys);

            const portiiValues: { [key: string]: string } = {};
            dataWithKeys.forEach((item: ExecutieReteta) => {
                portiiValues[item.codArticol] = item.totalPortii.toString();
            });
            setLocalPortiiValues(portiiValues);

            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError('Failed to fetch data: ' + errorMessage);
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };
    const fetchIngredients = async (codReteta: string) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/reteta-ingrediente/ingrediente?codReteta=${codReteta}`);

            const ingredientsWithKeys = response.data.map((ingredient: RetetaIngredient) => ({
                ...ingredient,
                localId: uuidv4()
            }));

            setIngredients(prev => ({
                ...prev,
                [codReteta]: ingredientsWithKeys
            }));

            const ingredientValues: { [key: string]: string } = {};
            ingredientsWithKeys.forEach((ingredient: RetetaIngredient) => {
                const key = `${ingredient.id.codReteta}|${ingredient.id.codIngredient}`;
                ingredientValues[key] = ingredient.necesar.toString();
            });
            setLocalIngredientValues(prev => ({
                ...prev,
                ...ingredientValues
            }));
        } catch (err) {
            console.error('Error fetching ingredients:', err);
        }
    };

    const checkInventoryAvailability = async (codArticol: string, quantityChange: number): Promise<{ ingredient: string, needed: number, available: number }[]> => {
        try {
            const ingredientsResponse = await axios.get(`http://localhost:8080/api/reteta-ingrediente/ingrediente?codReteta=${codArticol}`);
            const recipeIngredients = ingredientsResponse.data;
            const warnings: { ingredient: string, needed: number, available: number }[] = [];

            for (const ingredient of recipeIngredients) {
                const quantityNeeded = ingredient.cantitate * quantityChange;
                const inventoryEntries = await getInventoryEntries(ingredient.id.codIngredient);

                const totalAvailable = inventoryEntries.reduce((sum, entry) =>
                    sum + (entry.cantitate - entry.cantitateFolosita), 0
                );

                if (totalAvailable < quantityNeeded) {
                    warnings.push({
                        ingredient: ingredient.numeMateriePrima,
                        needed: quantityNeeded,
                        available: totalAvailable
                    });
                }
            }

            return warnings;
        } catch (err) {
            console.error('Error checking inventory:', err);
            return [];
        }
    };

    const updateTotalPortii = async (codArticol: string, newValue: number) => {
        try {
            const warnings = await checkInventoryAvailability(codArticol, newValue);
            if (warnings.length > 0) {
                setInventoryWarnings(warnings);
                setShowInventoryModal(true);
                setLocalPortiiValues(prev => ({
                    ...prev,
                    [codArticol]: newValue.toString()
                }));
            }
            await axios.put(
                `http://localhost:8080/api/executii-retete/update-portii`,
                null,
                {
                    params: {
                        codArticol: codArticol,
                        totalPortii: newValue
                    },
                }

            ).then(() => {
                fetchIngredients(codArticol);
            });

            const ingredientsResponse = await axios.get(`http://localhost:8080/api/reteta-ingrediente/ingrediente?codReteta=${codArticol}`);
            const recipeIngredients = ingredientsResponse.data;

            if (recipeIngredients.length > 0) {

                const currentItem = data.find(item => item.codArticol === codArticol);
                if (!currentItem) return;

                const quantityDifference = newValue - currentItem.totalPortii;

                if (quantityDifference !== 0) {
                    for (const ingredient of recipeIngredients) {
                        const ingredientQuantityChange = ingredient.cantitate * Math.abs(quantityDifference);

                        if (quantityDifference > 0) {
                            await updateInventoryAdd(ingredient.id.codIngredient, ingredientQuantityChange);
                        } else {
                            await updateInventoryRemove(ingredient.id.codIngredient, ingredientQuantityChange);
                        }
                    }
                }
            }

            setData(prev => prev.map(item =>
                item.codArticol === codArticol
                    ? { ...item, totalPortii: newValue, statusReteta: newValue > 0 ? 1 : 0 }
                    : item
            ));
            setFilteredData(prev => prev.map(item =>
                item.codArticol === codArticol
                    ? { ...item, totalPortii: newValue, statusReteta: newValue > 0 ? 1 : 0 }
                    : item
            ));
        } catch (err) {
            console.error('Error updating total portii:', err);
        }
    };

    const getInventoryEntries = async (codIngredient: string): Promise<IntraresMagazie[]> => {
        try {
            const response = await axios.get(`http://localhost:8080/api/intrari-magazie/ingredient?codIngredient=${codIngredient}`);
            const validEntries = response.data.filter((a: IntraresMagazie) => a.id.dataAchizitie);

            return validEntries.sort((a: IntraresMagazie, b: IntraresMagazie) =>
                a.id.dataAchizitie.localeCompare(b.id.dataAchizitie)
            );
        } catch (err) {
            console.error(`Error fetching inventory for ingredient ${codIngredient}:`, err);
            return [];
        }
    };

    const updateInventoryAdd = async (codIngredient: string, cantitateNecesara: number) => {
        try {
            const inventoryEntries = await getInventoryEntries(codIngredient);
            let remainingToAllocate = cantitateNecesara;

            for (const entry of inventoryEntries) {
                if (remainingToAllocate <= 0) break;

                const availableInEntry = entry.cantitate - entry.cantitateFolosita;

                if (availableInEntry > 0) {
                    const toAllocate = Math.min(remainingToAllocate, availableInEntry);
                    const newCantitateFolosita = entry.cantitateFolosita + toAllocate;

                    await axios.put(`http://localhost:8080/api/intrari-magazie/update-folosita`,
                        null,
                        {
                            params: {
                                codIngredient: entry.id.codIngredient,
                                dataAchizitie: entry.id.dataAchizitie,
                                cantitateFolosita: newCantitateFolosita
                            }
                        }
                    );
                    remainingToAllocate -= toAllocate;
                }
            }

            if (remainingToAllocate > 0) {
                console.warn(`Could not allocate ${remainingToAllocate} units of ingredient ${codIngredient} - insufficient stock`);
            }
        } catch (err) {
            console.error(`Error updating inventory for ingredient ${codIngredient}:`, err);
        }
    };

    const updateInventoryRemove = async (codIngredient: string, cantitateToRemove: number) => {
        try {
            const inventoryEntries = await getInventoryEntries(codIngredient);
            let remainingToRemove = cantitateToRemove;

            for (let i = inventoryEntries.length - 1; i >= 0 && remainingToRemove > 0; i--) {
                const entry = inventoryEntries[i];

                if (entry.cantitateFolosita > 0) {
                    const toRemove = Math.min(remainingToRemove, entry.cantitateFolosita);
                    const newCantitateFolosita = entry.cantitateFolosita - toRemove;

                    await axios.put(`http://localhost:8080/api/intrari-magazie/update-folosita`,
                        null,
                        {
                            params: {
                                codIngredient: entry.id.codIngredient,
                                dataAchizitie: entry.id.dataAchizitie,
                                cantitateFolosita: newCantitateFolosita
                            }
                        }
                    );
                    remainingToRemove -= toRemove;
                }
            }

            if (remainingToRemove > 0) {
                console.warn(`Could not remove ${remainingToRemove} units of ingredient ${codIngredient} - not enough was previously allocated`);
            }
        } catch (err) {
            console.error(`Error updating inventory for ingredient ${codIngredient}:`, err);
        }
    };

    const incrementPortii = async (codArticol: string, currentValue: number) => {
        const newValue = currentValue + 1;
        const warnings = await checkInventoryAvailability(codArticol, 1);
        if (warnings.length > 0) {
            setInventoryWarnings(warnings);
            setShowInventoryModal(true);
        }
        if (newValue > 0) {
            setData(prev =>
                prev.map(item =>
                    item.codArticol === codArticol
                        ? { ...item, statusReteta: 1 }
                        : item
                )
            );

            setFilteredData(prev =>
                prev.map(item =>
                    item.codArticol === codArticol
                        ? { ...item, statusReteta: 1 }
                        : item
                )
            );
        }
        setLocalPortiiValues(prev => ({
            ...prev,
            [codArticol]: newValue.toString()
        }));
    };

    const handlePortiiChange = (codArticol: string, value: string) => {
        let safeValue = Math.abs(parseInt(value)).toString();
        value = safeValue === "NaN" ? "0" : safeValue;

        setLocalPortiiValues(prev => ({
            ...prev,
            [codArticol]: value
        }));
    };

    const decrementPortii = (codArticol: string, currentValue: number) => {
        if (currentValue > 0) {
            const newValue = currentValue - 1;
            if (newValue === 0) {
                setData(prev =>
                    prev.map(item =>
                        item.codArticol === codArticol
                            ? { ...item, statusReteta: 0 }
                            : item
                    )
                );

                setFilteredData(prev =>
                    prev.map(item =>
                        item.codArticol === codArticol
                            ? { ...item, statusReteta: 0 }
                            : item
                    )
                );
            }
            setLocalPortiiValues(prev => ({
                ...prev,
                [codArticol]: newValue.toString()
            }));
        }
    };

    const toggleRowExpansion = (codReteta: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(codReteta)) {
            newExpanded.delete(codReteta);
        } else {
            newExpanded.add(codReteta);
            if (!ingredients[codReteta]) {
                fetchIngredients(codReteta);
            }
        }
        setExpandedRows(newExpanded);
    };

    const openModal = (type: 'add' | 'edit' | 'delete' | 'ingredient', item?: ExecutieReteta, ingredient?: RetetaIngredient) => {
        setModalType(type);
        setSelectedItem(item || null);
        setSelectedIngredient(ingredient || null);

        if (type === 'add') {
            setFormData({
                codArticol: '',
                portii: 0,
                um: 'PORTIE',
                totalPortii: 0,
                statusReteta: 1,
                dataUltimaModificare: new Date().toISOString().split('T')[0],
                utilizator: null,
                gramajPerPortie: 0,
                numeReteta: ''
            });
        } else if (type === 'ingredient') {
            setIngredientFormData(ingredient || {
                id: {
                    codReteta: item?.codArticol || '',
                    codIngredient: ''
                },
                cantitate: 0,
                um: 'KILOGRAM',
                necesar: 0,
                numeReteta: item?.numeReteta || '',
                numeMateriePrima: ''
            });
        } else if (item) {
            setFormData({ ...item });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedItem(null);
        setSelectedIngredient(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['portii', 'totalPortii', 'statusReteta', 'gramajPerPortie'].includes(name)
                ? value === '' ? 0 : Number(value)
                : value
        }));
    };

    const handleIngredientInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target;
        let safeValue = Math.abs(parseFloat(value)).toString();
        value = safeValue === "NaN" ? "0" : safeValue;
        if (name === 'codIngredient') {
            setIngredientFormData(prev => ({
                ...prev,
                id: {
                    ...prev.id,
                    codIngredient: value
                }
            }));
        } else {
            setIngredientFormData(prev => ({
                ...prev,
                [name]: ['cantitate', 'necesar'].includes(name)
                    ? value === '' ? 0 : Number(value)
                    : value
            }));
        }
    };

    const handleIngredientNeceserChange = (ingredient: RetetaIngredient, value: string) => {
        const key = `${ingredient.id.codReteta}|${ingredient.id.codIngredient}`;

        let safeValue = Math.abs(parseFloat(value)).toString();
        value = safeValue === "NaN" ? "0" : safeValue;

        setLocalIngredientValues(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const updateIngredient = async (ingredient: RetetaIngredient, field: string, value: number) => {
        if (field != 'necesar')
            return;

        try {
            const updatedIngredient = {
                ...ingredient,
                [field]: value
            };

            await axios.put(
                `http://localhost:8080/api/reteta-ingrediente/update-necesar`,
                null,
                {
                    params: {
                        codReteta: ingredient.id.codReteta,
                        codIngredient: ingredient.id.codIngredient,
                        necesar: value
                    }
                }
            ).then(() => {
                fetchIngredients(ingredient.id.codReteta);
            });
            setIngredients(prev => ({
                ...prev,
                [ingredient.id.codReteta]: prev[ingredient.id.codReteta].map(ing =>
                    ing.id.codIngredient === ingredient.id.codIngredient
                        ? updatedIngredient
                        : ing
                )
            }));
        } catch (err) {
            console.error('Error updating ingredient:', err);
        }
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

    const handleDeleteIngredient = async (ingredient: RetetaIngredient) => {
        try {
            await axios.delete(`http://localhost:8080/api/reteta-ingrediente/delete-ingredient`,
                {
                    params: {
                        codReteta: ingredient.id.codReteta,
                        codIngredient: ingredient.id.codIngredient
                    }

                }
            ).then(() => {
                fetchIngredients(ingredient.id.codReteta);
            });
            if (selectedItem) fetchIngredients(selectedItem.codArticol);
        } catch (err) {
            console.error('Failed to delete ingredient:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (modalType === 'add') {
                await axios.post('http://localhost:8080/api/retete', formData);
            } else if (modalType === 'edit' && selectedItem) {
                await axios.put(
                    `http://localhost:8080/api/executii-retete/update?codArticol=${selectedItem.codArticol}`,
                    formData
                );
            } else if (modalType === 'delete' && selectedItem) {
                await axios.delete(`http://localhost:8080/api/executii-retete/delete-reteta?codArticol=${selectedItem.codArticol}`);
            } else if (modalType === 'ingredient') {
                if (selectedIngredient) {
                    await axios.delete(`http://localhost:8080/api/reteta-ingrediente/${ingredientFormData.id.codReteta}/${ingredientFormData.id.codIngredient}`);
                } else {
                    await axios.post('http://localhost:8080/api/reteta-ingrediente', ingredientFormData);
                }
                if (selectedItem) {
                    fetchIngredients(selectedItem.codArticol);
                }
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
                        <h1 className="text-2xl font-bold text-gray-800">Retete</h1>
                        <button
                            onClick={() => openModal('add')}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                        >
                            <Plus className="w-4 h-4" />
                            Adauga Reteta
                        </button>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Cauta dupa nume reteta, cod articol sau UM..."
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
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Denumire Reteta
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cod Articol
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Portii
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    UM
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Portii in Meniul Zilei
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Gramaj per Portie
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actiuni
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((item, _) => (
                                <React.Fragment key={item.localId}>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => toggleRowExpansion(item.codArticol)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                {expandedRows.has(item.codArticol) ? (
                                                    <ChevronUp className="w-4 h-4" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {item.numeReteta}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {item.codArticol}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {item.portii}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {item.um}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => decrementPortii(item.codArticol, parseInt(localPortiiValues[item.codArticol] || '0'))}
                                                    className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-gray-600 transition-colors duration-200"
                                                    disabled={localPortiiValues[item.codArticol].length < 0}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <input
                                                    min="0"
                                                    value={localPortiiValues[item.codArticol]}
                                                    onChange={(e) => handlePortiiChange(item.codArticol, e.target.value)}
                                                    className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    onClick={(e) => e.currentTarget.select()}
                                                />
                                                <button
                                                    onClick={() => incrementPortii(item.codArticol, parseInt(localPortiiValues[item.codArticol] || '0'))}
                                                    className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-gray-600 transition-colors duration-200"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {item.gramajPerPortie}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.statusReteta === 1
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {item.statusReteta === 1 ? 'Activa' : 'Inactiva'}
                                            </span>
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
                                    {expandedRows.has(item.codArticol) && (
                                        <tr>
                                            <td colSpan={9} className="px-6 py-4 bg-gray-50">
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="text-lg font-medium text-gray-800">Ingrediente</h4>
                                                        <button
                                                            onClick={() => openModal('ingredient', item)}
                                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-2"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                            Adauga Ingredient
                                                        </button>
                                                    </div>
                                                    <div className="bg-white rounded-lg overflow-hidden shadow">
                                                        <table className="w-full text-sm">
                                                            <thead className="bg-gray-100">
                                                                <tr>
                                                                    <th className="px-4 py-2 text-left">Ingredient</th>
                                                                    <th className="px-4 py-2 text-left">Cod Ingredient</th>
                                                                    <th className="px-4 py-2 text-left">Cantitate</th>
                                                                    <th className="px-4 py-2 text-left">UM</th>
                                                                    <th className="px-4 py-2 text-left">Necesar</th>
                                                                    <th className="px-4 py-2 text-left">Actiuni</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {(ingredients[item.codArticol] || []).map((ingredient, _) => {
                                                                    const ingredientKey = `${ingredient.id.codReteta}|${ingredient.id.codIngredient}`;
                                                                    return (
                                                                        <tr key={ingredient.localId} className="border-t">
                                                                            <td className="px-4 py-2">{ingredient.numeMateriePrima}</td>
                                                                            <td className="px-4 py-2">{ingredient.id.codIngredient}</td>
                                                                            <td className="px-4 py-2">{ingredient.cantitate.toPrecision(3)}</td>
                                                                            <td className="px-4 py-2">{ingredient.um}</td>
                                                                            <td className="px-4 py-2">
                                                                                <input
                                                                                    type="number"
                                                                                    value={localIngredientValues[ingredientKey]}
                                                                                    onChange={(e) => handleIngredientNeceserChange(ingredient, e.target.value)}
                                                                                    className="w-30 px-2 py-1 border border-gray-300 rounded text-sm"
                                                                                    step="0.0001"
                                                                                    min="0"
                                                                                    onClick={(e) => e.currentTarget.select()}
                                                                                />
                                                                            </td>
                                                                            <td className="px-4 py-2">
                                                                                <button
                                                                                    onClick={() => confirmDeleteIngredient(ingredient)}
                                                                                    className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors duration-200"
                                                                                >
                                                                                    <Trash2 className="w-3 h-3" />
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                    {filteredData.length === 0 && !loading && (
                        <div className="text-center py-8 text-gray-500">
                            {searchTerm
                                ? 'Nu au fost gasite rezultate pentru cautarea ta'
                                : 'Nu sunt retete disponibile'}
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
                                        onClick={() => handlePageChange(page)}
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
            {showInventoryModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-red-600">
                                Stoc Insuficient
                            </h2>
                            <button
                                onClick={() => setShowInventoryModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-700 mb-4">
                                Nu există suficient stoc pentru următoarele ingrediente:
                            </p>

                            <div className="space-y-2 mb-6">
                                {inventoryWarnings.map((warning, index) => (
                                    <div key={index} className="bg-red-50 border border-red-200 rounded p-3">
                                        <p className="font-medium text-red-800">{warning.ingredient}</p>
                                        <p className="text-sm text-red-600">
                                            Necesar: {warning.needed.toFixed(2)} | Disponibil: {warning.available.toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center">
                                <button
                                    onClick={() => setShowInventoryModal(false)}
                                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                                >
                                    Înțeles
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showDeleteModal && ingredientToDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                        <p className="text-gray-700 mb-6">
                            Esti sigur ca vrei sa stergi ingredientul "{ingredientToDelete.numeMateriePrima}"?
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            >
                                Anuleaza
                            </button>
                            <button
                                type="button"
                                onClick={async () => {
                                    await handleDeleteIngredient(ingredientToDelete);
                                    setShowDeleteModal(false);
                                    setIngredientToDelete(null);
                                }}
                                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                            >
                                Sterge
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showDeleteModal && ingredientToDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                        <p className="text-gray-700 mb-6">
                            Esti sigur ca vrei sa stergi ingredientul "{ingredientToDelete.numeMateriePrima}"?
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            >
                                Anuleaza
                            </button>
                            <button
                                type="button"
                                onClick={async () => {
                                    await handleDeleteIngredient(ingredientToDelete);
                                    setShowDeleteModal(false);
                                    setIngredientToDelete(null);
                                }}
                                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                            >
                                Sterge
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">
                                {modalType === 'add'
                                    ? 'Adauga Reteta'
                                    : modalType === 'edit'
                                        ? 'Modifica Reteta'
                                        : modalType === 'delete'
                                            ? 'Sterge Reteta'
                                            : 'Modifica Ingredient'}
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
                                        Esti sigur ca vrei sa stergi reteta "{selectedItem?.numeReteta}"?
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
                            ) : modalType === 'ingredient' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                                    <div className="md:col-span-2 relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Alege Ingredient
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Cauta ingredient..."
                                            value={ingredientSearch}
                                            onChange={(e) => setIngredientSearch(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />

                                        {filteredIngredients.length > 0 && ingredientSearch && (
                                            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-auto shadow-lg">
                                                {filteredIngredients.map((ing) => (
                                                    <li
                                                        key={ing.codArticol}
                                                        className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                                                        onClick={() => {
                                                            setIngredientFormData({
                                                                ...ingredientFormData,
                                                                id: {
                                                                    codReteta: ingredientFormData.id.codReteta,
                                                                    codIngredient: ing.codArticol
                                                                },
                                                                numeMateriePrima: ing.denumire,
                                                                um: ing.um
                                                            });
                                                            setIngredientSearch(ing.denumire);
                                                            setFilteredIngredients([]);
                                                        }}
                                                    >
                                                        {ing.denumire} ({ing.um})
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Cantitate
                                        </label>
                                        <input
                                            type="number"
                                            name="cantitate"
                                            value={ingredientFormData.cantitate}
                                            onChange={handleIngredientInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            step="0.0001"
                                            required
                                            onClick={(e) => e.currentTarget.select()}
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Necesar
                                        </label>
                                        <input
                                            type="number"
                                            name="necesar"
                                            value={ingredientFormData.necesar}
                                            onChange={handleIngredientInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                            onClick={(e) => e.currentTarget.select()}

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
                                            {selectedIngredient ? 'Salveaza' : 'Adauga'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {modalType === 'add' ? (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Cod Articol
                                                </label>
                                                <input
                                                    type="text"
                                                    name="codArticol"
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
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Cont Stoc
                                                </label>
                                                <input
                                                    type="text"
                                                    name="contStoc"
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Denumire
                                                </label>
                                                <input
                                                    type="text"
                                                    name="denumire"

                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Denumire Scurta
                                                </label>
                                                <input
                                                    type="text"
                                                    name="denumireScurta"
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Denumire UM
                                                </label>
                                                <select
                                                    name="um"
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                >
                                                    {denumireUmOptions.map((um) => (
                                                        <option key={um} value={um}>{um}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Gestiune
                                                </label>
                                                <input
                                                    type="number"
                                                    name="gestiune"
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
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    TVA Vanzare
                                                </label>
                                                <input
                                                    type="text"
                                                    name="tvaVanzare"
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    TVA Vanzare 1
                                                </label>
                                                <input
                                                    type="text"
                                                    name="tvaVanzare1"
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    UM
                                                </label>
                                                <select
                                                    name="um"
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                >
                                                    {umOptions.map((um) => (
                                                        <option key={um} value={um}>{um}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </>
                                    ) : (

                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Cod Articol
                                                </label>
                                                <input
                                                    type="text"
                                                    name="codArticol"
                                                    value={formData.codArticol}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                                    required
                                                    disabled={modalType === 'edit'}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Portii
                                                </label>
                                                <input
                                                    type="number"
                                                    name="portii"
                                                    value={formData.portii}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Nume Reteta
                                                </label>
                                                <input
                                                    type="text"
                                                    name="numeReteta"
                                                    value={formData.numeReteta}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    UM
                                                </label>
                                                <select
                                                    name="um"
                                                    value={formData.um}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                >
                                                    {umOptions.map((um) => (
                                                        <option key={um} value={um}>{um}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Total Portii
                                                </label>
                                                <input
                                                    type="number"
                                                    name="totalPortii"
                                                    value={formData.totalPortii}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                    onClick={(e) => e.currentTarget.select()}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Gramaj per Portie
                                                </label>
                                                <input
                                                    type="number"
                                                    name="gramajPerPortie"
                                                    value={formData.gramajPerPortie}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                    onClick={(e) => e.currentTarget.select()}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Data Ultima Modificare
                                                </label>
                                                <input
                                                    type="date"
                                                    name="dataUltimaModificare"
                                                    value={formData.dataUltimaModificare}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Utilizator
                                                </label>
                                                <input
                                                    type="text"
                                                    name="utilizator"
                                                    value={formData.utilizator || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </>
                                    )}

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

export default Retete;