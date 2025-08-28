import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, X, Search, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Minus, Check } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

interface MeniuZileiItem {
    codArticol: string;
    portii: number;
    um: string;
    totalPortii: number;
    statusReteta: number;
    dataUltimaModificare: string;
    utilizator: string | null;
    gramajPerPortie: number;
    numeReteta: string;
    pretStandard?: number;
    valoareStandard?: number;
    localId?: string;
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
    pretMateriePrima?: number;
    localId?: string;
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

const MeniuZilei = () => {
    const [data, setData] = useState<MeniuZileiItem[]>([]);
    const [filteredData, setFilteredData] = useState<MeniuZileiItem[]>([]);
    const [ingredients, setIngredients] = useState<{ [key: string]: RetetaIngredient[] }>({});
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<'delete'>('delete');
    const [selectedItem, setSelectedItem] = useState<MeniuZileiItem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showFinalizeModal, setShowFinalizeModal] = useState(false);
    const [recipesWithoutIngredients, setRecipesWithoutIngredients] = useState<Set<string>>(new Set());
    const [showInventoryModal, setShowInventoryModal] = useState(false);
    const [inventoryWarnings, setInventoryWarnings] = useState<{ ingredient: string, needed: number, available: number }[]>([]);


    const [localPortiiValues, setLocalPortiiValues] = useState<{ [key: string]: string }>({});

    const debouncedPortiiValues = useDebounce(localPortiiValues, 300);
    useEffect(() => {
        fetchData();
    }, []);

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

        for (const codArticol in debouncedPortiiValues) {
            if (parseInt(debouncedPortiiValues[codArticol]) === 0) {
                fetchData();
            }
        }
    }, [debouncedPortiiValues]);

    useEffect(() => {
        Object.entries(debouncedPortiiValues).forEach(([codArticol, value]: any) => {
            const numValue = value === '' ? 0 : parseInt(value);
            if (!isNaN(numValue) && numValue >= 0) {
                const currentItem = data.find(item => item.codArticol === codArticol);
                if (currentItem && currentItem.totalPortii !== numValue) {
                    updateTotalPortiiOnly(codArticol, numValue);
                }
            }
        });
    }, [debouncedPortiiValues]);


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

    const updateTotalPortiiOnly = async (codArticol: string, newValue: number) => {
        try {
            await axios.put(
                `http://localhost:8080/api/executii-retete/update-portii`,
                null,
                {
                    params: {
                        codArticol: codArticol,
                        totalPortii: newValue
                    },
                }
            );

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

            fetchIngredients(codArticol);
        } catch (err) {
            console.error('Error updating total portii:', err);
            setError('Failed to update portions');
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

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/meniu-zilnic');

            const dataWithKeys = response.data.map((item: MeniuZileiItem) => ({
                ...item,
                localId: uuidv4(),
            }));

            const recipesWithoutIngredientsSet = new Set<string>();
            const updatedData = [];

            for (const item of dataWithKeys) {
                try {
                    const ingredientsResponse = await axios.get(`http://localhost:8080/api/reteta-ingrediente/ingrediente?codReteta=${item.codArticol}`);
                    const recipeIngredients = ingredientsResponse.data;

                    if (recipeIngredients.length === 0) {
                        recipesWithoutIngredientsSet.add(item.codArticol);
                        updatedData.push({
                            ...item,
                            pretStandard: item.pretStandard || 0,
                            pretCalculat: item.pretCalculat || 0
                        });
                    } else {
                        const calculatedPrice = await calculatePretStandard(item.codArticol, item.portii, recipeIngredients);
                        updatedData.push({
                            ...item,
                            pretStandard: calculatedPrice,
                            pretCalculat: calculatedPrice
                        });
                    }
                } catch (err) {
                    console.error(`Error fetching ingredients for ${item.codArticol}:`, err);
                    recipesWithoutIngredientsSet.add(item.codArticol);
                    updatedData.push({
                        ...item,
                        pretStandard: item.pretStandard || 0,
                    });
                }
            }

            setRecipesWithoutIngredients(recipesWithoutIngredientsSet);
            setData(updatedData);
            setFilteredData(updatedData);

            const portiiValues: { [key: string]: string } = {};
            updatedData.forEach((item: MeniuZileiItem) => {
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

    const checkInventoryAvailability = async (codArticol: string, quantityChange: number): Promise<{ ingredient: string, needed: number, available: number }[]> => {
        if (recipesWithoutIngredients.has(codArticol) || quantityChange <= 0) {
            return [];
        }

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

    const fetchIngredients = async (codReteta: string) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/reteta-ingrediente/ingrediente?codReteta=${codReteta}`);

            const ingredientsWithPrices = await Promise.all(
                response.data.map(async (ingredient: RetetaIngredient) => {
                    try {
                        const priceResponse = await axios.get(`http://localhost:8080/api/materii-prime/${ingredient.id.codIngredient}`);
                        return {
                            ...ingredient,
                            localId: uuidv4(),
                            pretMateriePrima: priceResponse.data.pretMateriePrima
                        };
                    } catch (err) {
                        console.error(`Error fetching price for ingredient ${ingredient.id.codIngredient}:`, err);
                        return {
                            ...ingredient,
                            localId: uuidv4(),
                            pretMateriePrima: 0
                        };
                    }
                })
            );

            setIngredients(prev => ({
                ...prev,
                [codReteta]: ingredientsWithPrices
            }));
        } catch (err) {
            console.error('Error fetching ingredients:', err);
        }
    };

    const updateTotalPortii = async (codArticol: string, newValue: number) => {
        try {
            const currentItem = data.find(item => item.codArticol === codArticol);
            if (!currentItem) return;

            const quantityDifference = newValue - currentItem.totalPortii;

            if (quantityDifference !== 0) {
                const ingredientsResponse = await axios.get(`http://localhost:8080/api/reteta-ingrediente/ingrediente?codReteta=${codArticol}`);
                const recipeIngredients = ingredientsResponse.data;

                if (recipeIngredients.length > 0) {
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
            await updateTotalPortiiOnly(codArticol, newValue);
        } catch (err) {
            console.error('Error updating total portii:', err);
            setError('Failed to update portions');
        }
    };


    const handleFinalizeDay = async () => {
        setShowFinalizeModal(false);
        try {
            const meniuZilnicResponse = await axios.get('http://localhost:8080/api/meniu-zilnic');
            const reteteDeArhivat = meniuZilnicResponse.data;

            const raportResponse = await axios.get('http://localhost:8080/api/raport-meniul-zilei');
            const existingCodArticole = new Set(
                Array.isArray(raportResponse.data)
                    ? raportResponse.data.map((item: any) => item.codArticol)
                    : []
            );

            for (const reteta of reteteDeArhivat) {
                if (!existingCodArticole.has(reteta.codArticol)) {
                    const raportItem = {
                        id: {
                            codArticol: reteta.codArticol,
                            dataDeProducere: new Date().toISOString().split('T')[0]
                        },
                        portii: reteta.portii,
                        gramajPerPortie: reteta.gramajPerPortie,
                        um: reteta.um,
                        totalPortii: reteta.totalPortii,
                        statusReteta: reteta.statusReteta,
                        dataUltimaModificare: reteta.dataUltimaModificare,
                        utilizator: reteta.utilizator,
                        numeReteta: reteta.numeReteta,
                        pretStandard: reteta.pretStandard || 0,
                        valoareStandard: reteta.valoareStandard || 0,
                    };

                    await axios.post('http://localhost:8080/api/raport-meniul-zilei', raportItem);
                } else {
                    console.log(`Reteta cu codul ${reteta.codArticol} exista deja in raport. Sar peste.`);
                }
            }

            await axios.delete('http://localhost:8080/api/meniu-zilnic/finalizare-zi');

            await fetchData();

        } catch (err) {
            console.error('Error finalizing day:', err);
            setError('Failed to finalize day');
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


    const calculatePretStandard = async (_: string, portii: number, ingredients: RetetaIngredient[]): Promise<number> => {
        try {
            let totalPrice = 0;

            for (const ingredient of ingredients) {
                const response = await axios.get(`http://localhost:8080/api/materii-prime/${ingredient.id.codIngredient}`);
                const materiePrima: MateriePrima = response.data;

                const ingredientCost = (ingredient.cantitate * materiePrima.pretMateriePrima) / portii;
                totalPrice += ingredientCost;
            }

            return totalPrice;
        } catch (err) {
            console.error('Error calculating price:', err);
            return 0;
        }
    };

    const handlePortiiChange = async (codArticol: string, value: string) => {
        let safeValue = Math.abs(parseInt(value)).toString();
        value = safeValue === "NaN" ? "0" : safeValue;

        const currentItem = data.find(item => item.codArticol === codArticol);
        if (!currentItem) return;
        const newValue = parseInt(value);
        const currentValue = currentItem.totalPortii;
        const difference = newValue - currentValue;

        if (difference > 0) {
            const warnings = await checkInventoryAvailability(codArticol, difference);
            if (warnings.length > 0) {
                setInventoryWarnings(warnings);
                setShowInventoryModal(true);
            }
        }

        if (value === "0") {
            try {
                if (!recipesWithoutIngredients.has(codArticol)) {
                    const currentItem = data.find(item => item.codArticol === codArticol);
                    if (currentItem) {
                        const ingredientsResponse = await axios.get(`http://localhost:8080/api/reteta-ingrediente/ingrediente?codReteta=${codArticol}`);
                        const recipeIngredients = ingredientsResponse.data;

                        for (const ingredient of recipeIngredients) {
                            const quantityToRemove = ingredient.cantitate * currentItem.totalPortii;
                            await updateInventoryRemove(ingredient.id.codIngredient, quantityToRemove);
                        }
                    }
                }
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

                await axios.delete(`http://localhost:8080/api/meniu-zilnic/delete-reteta-from-meniu?codArticol=${codArticol}`);

                setData(prev => prev.filter(item => item.codArticol !== codArticol));
                setFilteredData(prev => prev.filter(item => item.codArticol !== codArticol));


            } catch (err) {
                console.error('Error deleting total portii:', err);
            }
        } else {
            setLocalPortiiValues(prev => ({
                ...prev,
                [codArticol]: value
            }));
        }
    };

    const decrementPortii = async (codArticol: string, currentValue: number) => {
        if (currentValue > 0) {
            const newValue = currentValue - 1;

            setLocalPortiiValues(prev => ({
                ...prev,
                [codArticol]: newValue.toString(),
            }));

            if (newValue === 0) {
                try {

                    const ingredientsResponse = await axios.get(`http://localhost:8080/api/reteta-ingrediente/ingrediente?codReteta=${codArticol}`);
                    const recipeIngredients = ingredientsResponse.data;

                    const inventoryPromises = recipeIngredients.map((ingredient: RetetaIngredient) => {
                        const quantityToRemove = ingredient.cantitate * currentValue;
                        return updateInventoryRemove(ingredient.id.codIngredient, quantityToRemove);
                    });

                    await Promise.all(inventoryPromises);


                    const updateState = (prev: any[]) => prev.map(item =>
                        item.codArticol === codArticol ? { ...item, statusReteta: 0 } : item
                    );
                    setData(updateState);
                    setFilteredData(updateState);

                    await axios.delete(`http://localhost:8080/api/meniu-zilnic/delete-reteta-from-meniu?codArticol=${codArticol}`);

                    setData(prev => prev.filter(item => item.codArticol !== codArticol));
                    setFilteredData(prev => prev.filter(item => item.codArticol !== codArticol));

                } catch (err) {
                    console.error('Error deleting total portii:', err);
                    setLocalPortiiValues(prev => ({
                        ...prev,
                        [codArticol]: currentValue.toString()
                    }));
                }
            } else {
                try {
                    if (!recipesWithoutIngredients.has(codArticol)) {
                        const ingredientsResponse = await axios.get(`http://localhost:8080/api/reteta-ingrediente/ingrediente?codReteta=${codArticol}`);
                        const recipeIngredients = ingredientsResponse.data;

                        const inventoryPromises = recipeIngredients.map((ingredient: RetetaIngredient) => {
                            return updateInventoryRemove(ingredient.id.codIngredient, ingredient.cantitate);
                        });

                        await Promise.all(inventoryPromises);
                    }

                    await updateTotalPortii(codArticol, newValue);

                } catch (err) {
                    console.error('Error decrementing portii:', err);
                    setLocalPortiiValues(prev => ({
                        ...prev,
                        [codArticol]: currentValue.toString()
                    }));
                }
            }
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

    const openModal = (type: 'delete', item: MeniuZileiItem) => {
        setModalType(type);
        setSelectedItem(item);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedItem(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (modalType === 'delete' && selectedItem) {
                const ingredientsResponse = await axios.get(`http://localhost:8080/api/reteta-ingrediente/ingrediente?codReteta=${selectedItem.codArticol}`);
                const recipeIngredients = ingredientsResponse.data;

                for (const ingredient of recipeIngredients) {
                    const quantityToRemove = ingredient.cantitate * selectedItem.totalPortii;
                    await updateInventoryRemove(ingredient.id.codIngredient, quantityToRemove);
                }

                await axios.delete(`http://localhost:8080/api/meniu-zilnic/delete-reteta-from-meniu?codArticol=${selectedItem.codArticol}`);
            }
            await fetchData();
            closeModal();
        } catch (err) {
            console.error('Error performing operation:', err);
            setError('Failed to perform operation');
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
                        <h1 className="text-2xl font-bold text-gray-800">Meniul Zilei</h1>
                        <button
                            onClick={() => setShowFinalizeModal(true)}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                            disabled={filteredData.length === 0}
                        >
                            <Check className="w-4 h-4" />
                            Finalizare Zi
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
                                    Pret Standard
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
                                                {expandedRows.has(item.codArticol) ?
                                                    <ChevronUp className="w-4 h-4" /> :
                                                    <ChevronDown className="w-4 h-4" />
                                                }
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
                                                    disabled={parseInt(localPortiiValues[item.codArticol] || '0') <= 0}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <input
                                                    min="0"
                                                    value={localPortiiValues[item.codArticol] || '0'}
                                                    onChange={(e) => handlePortiiChange(item.codArticol, e.target.value)}
                                                    onClick={(e) => e.currentTarget.select()}
                                                    className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                            <div className="text-sm text-gray-900">
                                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-center block w-20">
                                                    {item.pretStandard?.toFixed(2) || '0.00'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.statusReteta === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {item.statusReteta === 1 ? 'Activa' : 'Inactiva'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openModal('delete', item)}
                                                    className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors duration-200"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {expandedRows.has(item.codArticol) && ingredients[item.codArticol] && (
                                        <tr>
                                            <td colSpan={9} className="px-6 py-4 bg-gray-50">
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="text-lg font-medium text-gray-800">Ingrediente (Doar vizualizare)</h4>
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
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {ingredients[item.codArticol].map((ingredient) => (
                                                                    <tr key={ingredient.localId} className="border-t">
                                                                        <td className="px-4 py-2">{ingredient.numeMateriePrima}</td>
                                                                        <td className="px-4 py-2">{ingredient.id.codIngredient}</td>
                                                                        <td className="px-4 py-2">{ingredient.cantitate.toPrecision(3)}</td>
                                                                        <td className="px-4 py-2">{ingredient.um}</td>
                                                                        <td className="px-4 py-2">
                                                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                                                                {ingredient.necesar}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                ))}
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
                            {searchTerm ? 'Nu au fost gasite rezultate pentru cautarea ta' : 'Nu sunt elemente in meniul zilei'}
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
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">
                                Sterge din Meniul Zilei
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="text-center">
                                <p className="text-gray-700 mb-6">
                                    Esti sigur ca vrei sa stergi "{selectedItem?.numeReteta}" din meniul zilei?
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
                        </form>
                    </div>
                </div>
            )}
            {showFinalizeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">
                                Finalizare Zi
                            </h2>
                            <button
                                onClick={() => setShowFinalizeModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="text-center">
                                <p className="text-gray-700 mb-6">
                                    Esti sigur ca vrei sa finalizezi ziua? Aceasta actiune va sterge toate retetele din meniul zilei.
                                </p>
                                <div className="flex justify-center space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowFinalizeModal(false)}
                                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        Anuleaza
                                    </button>

                                    <button
                                        onClick={handleFinalizeDay}
                                        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
                                    >
                                        Finalizare Zi
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MeniuZilei;