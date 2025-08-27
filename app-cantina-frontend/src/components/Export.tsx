import { useState, useEffect } from "react";
import { Download, X, Eye, FileText, File, FileSpreadsheet, Database } from "lucide-react";

const dataSourceConfigs = {
    'situatie-cantitativ-valorica': {
        name: 'Situatie Cantitativ-Valorica',
        endpoint: null,
        icon: <Database className="w-4 h-4" />,
        columns: []
    },
    'meniu-zilei-raport': {
        name: 'Meniu Zilei (Raport)',
        endpoint: `http://localhost:8080/api/raport-meniul-zilei/meniu-zilei-raport`,
        icon: <FileText className="w-4 h-4" />,
        columns: [
            { key: 'Poz.', label: 'Poz.', type: 'string' },
            { key: 'Articol', label: 'Articol', type: 'string' },
            { key: 'Nume Articol', label: 'Nume Articol', type: 'string' },
            { key: 'UM Doc.', label: 'UM Doc.', type: 'string' },
            { key: 'Cont Stoc', label: 'Cont Stoc', type: 'string' },
            { key: 'Zona', label: 'Zona', type: 'number' },
            { key: 'Purtator', label: 'Purtator', type: 'number' },
            { key: 'Q. Doc.', label: 'Q. Doc.', type: 'number' },
            { key: 'Q. Livrata Doc.', label: 'Q. Livrata Doc.', type: 'number' },
            { key: 'Pret St.', label: 'Pret St.', type: 'number' },
            { key: 'Val. St.', label: 'Val. St.', type: 'number' },
            { key: 'Denumire', label: 'Denumire', type: 'string' },
            { key: 'Denumire Produs', label: 'Denumire Produs', type: 'string' },
            { key: 'Data Lot', label: 'Data Lot', type: 'date' },
            { key: 'Lot Nou', label: 'Lot Nou', type: 'string' }
        ]
    },
    'fisa-magazie': {
        name: 'Fisa de Magazie (Raport)',
        endpoint: null,
        icon: <File className="w-4 h-4" />,
        columns: [
            { key: 'Gestiune', label: 'Gestiune', type: 'string' },
            { key: 'Denumire Gestiune', label: 'Denumire Gestiune', type: 'string' },
            { key: 'Cod articol', label: 'Cod articol', type: 'string' },
            { key: 'Denumire articol', label: 'Denumire articol', type: 'string' },
            { key: 'UM', label: 'UM', type: 'string' },
            { key: 'Cont', label: 'Cont', type: 'string' },
            { key: 'Pret', label: 'Pret', type: 'number' },
            { key: 'Stoc Initial', label: 'Stoc Initial', type: 'number' },
            { key: 'Cantitate Intrata', label: 'Cantitate Intrata', type: 'number' },
            { key: 'Cantitate Iesita', label: 'Cantitate Iesita', type: 'number' },
            { key: 'Stoc Final', label: 'Stoc Final', type: 'number' },
            { key: 'Valoare stoc initial', label: 'Valoare stoc initial', type: 'number' },
            { key: 'Valoare intrari', label: 'Valoare intrari', type: 'number' },
            { key: 'Valoare iesiri', label: 'Valoare iesiri', type: 'number' },
            { key: 'Valoare stoc final', label: 'Valoare stoc final', type: 'number' },
            { key: 'Tip doc.', label: 'Tip doc.', type: 'string' },
            { key: 'Cod doc.', label: 'Cod doc.', type: 'string' },
            { key: 'Nr. doc', label: 'Nr. doc', type: 'string' },
            { key: 'Data document', label: 'Data document', type: 'date' },
            { key: 'Data efectiva', label: 'Data efectiva', type: 'date' },
            { key: 'Numar Tranzactie', label: 'Numar Tranzactie', type: 'string' },
            { key: 'Nr.Lot', label: 'Nr.Lot', type: 'string' },
            { key: 'Tip', label: 'Tip', type: 'string' }
        ]
    },
    'executii-retete': {
        name: 'Executii Retete',
        endpoint: `http://localhost:8080/api/executii-retete`,
        icon: <Database className="w-4 h-4" />,
        columns: [
            { key: 'codArticol', label: 'Cod Articol', type: 'string' },
            { key: 'numeReteta', label: 'Nume Reteta', type: 'string' },
            { key: 'portii', label: 'Portii', type: 'number' },
            { key: 'um', label: 'UM', type: 'string' },
            { key: 'totalPortii', label: 'Total Portii', type: 'number' },
            { key: 'statusReteta', label: 'Status Reteta', type: 'number' },
            { key: 'dataUltimaModificare', label: 'Data Ultima Modificare', type: 'date' },
            { key: 'utilizator', label: 'Utilizator', type: 'string' },
            { key: 'gramajPerPortie', label: 'Gramaj per Portie', type: 'number' }
        ]
    },
    'materii-prime': {
        name: 'Materii Prime',
        endpoint: `http://localhost:8080/api/materii-prime`,
        icon: <FileSpreadsheet className="w-4 h-4" />,
        columns: [
            { key: 'codArticol', label: 'Cod Articol', type: 'string' },
            { key: 'denumire', label: 'Denumire', type: 'string' },
            { key: 'denumireScurta', label: 'Denumire Scurta', type: 'string' },
            { key: 'codMoneda', label: 'Cod Moneda', type: 'string' },
            { key: 'denumireUm', label: 'Denumire UM', type: 'string' },
            { key: 'um', label: 'UM', type: 'string' },
            { key: 'gestiune', label: 'Gestiune', type: 'string' },
            { key: 'gestiune1', label: 'Gestiune 1', type: 'string' },
            { key: 'tvaVanzare', label: 'TVA Vanzare', type: 'string' },
            { key: 'pretMateriePrima', label: 'Pret Materie Prima', type: 'number' },
            { key: 'stoculActualTotal', label: 'Stocul Actual Total', type: 'number' }
        ]
    },
    'intrari-magazie': {
        name: 'Intrari Magazie',
        endpoint: `http://localhost:8080/api/intrari-magazie`,
        icon: <File className="w-4 h-4" />,
        columns: [
            { key: 'id.codIngredient', label: 'Cod Ingredient', type: 'string' },
            { key: 'id.dataAchizitie', label: 'Data Achizitie', type: 'date' },
            { key: 'numeIngredient', label: 'Nume Ingredient', type: 'string' },
            { key: 'cantitate', label: 'Cantitate', type: 'number' },
            { key: 'cantitateFolosita', label: 'Cantitate Folosita', type: 'number' },
            { key: 'pretAchizitie', label: 'Pret Achizitie', type: 'number' },
            { key: 'pretTotalCantitateCumparata', label: 'Pret Total Cantitate Cumparata', type: 'number' },
            { key: 'pretTotalCantitateUtilizata', label: 'Pret Total Cantitate Utilizata', type: 'number' }
        ]
    },
    'meniul-zilei': {
        name: 'Meniul Zilei',
        endpoint: `http://localhost:8080/api/meniu-zilnic`,
        icon: <FileText className="w-4 h-4" />,
        columns: [
            { key: 'codArticol', label: 'Cod Articol', type: 'string' },
            { key: 'numeReteta', label: 'Nume Reteta', type: 'string' },
            { key: 'portii', label: 'Portii', type: 'number' },
            { key: 'um', label: 'UM', type: 'string' },
            { key: 'totalPortii', label: 'Total Portii', type: 'number' },
            { key: 'statusReteta', label: 'Status Reteta', type: 'number' },
            { key: 'dataUltimaModificare', label: 'Data Ultima Modificare', type: 'date' },
            { key: 'utilizator', label: 'Utilizator', type: 'string' },
            { key: 'gramajPerPortie', label: 'Gramaj per Portie', type: 'number' }
        ]
    },
    'reteta-ingrediente': {
        name: 'Reteta Ingrediente',
        endpoint: `http://localhost:8080/api/reteta-ingrediente`,
        icon: <Database className="w-4 h-4" />,
        columns: [
            { key: 'id.codReteta', label: 'Cod Reteta', type: 'string' },
            { key: 'id.codIngredient', label: 'Cod Ingredient', type: 'string' },
            { key: 'numeReteta', label: 'Nume Reteta', type: 'string' },
            { key: 'numeMateriePrima', label: 'Nume Materie Prima', type: 'string' },
            { key: 'cantitate', label: 'Cantitate', type: 'number' },
            { key: 'um', label: 'UM', type: 'string' },
            { key: 'necesar', label: 'Necesar', type: 'number' }
        ]
    }
};

const Export = () => {
    const [selectedSources, setSelectedSources] = useState<string[]>([]);
    const [columnConfigs, setColumnConfigs] = useState<{ [key: string]: { [key: string]: boolean } }>({});
    const [data, setData] = useState<{[key: string]: any[]}>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [exportFormat] = useState<'csv' | 'xlsx' | 'xls' | 'pdf'>('xlsx');
    const [fileName] = useState<string>('export_data');
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const isSpecialReport = selectedSources.includes('situatie-cantitativ-valorica');
    
    useEffect(() => {
        const newColumnConfigs: { [key: string]: { [key: string]: boolean } } = {};
        selectedSources.forEach(source => {
            if (!columnConfigs[source]) {
                newColumnConfigs[source] = {};
                if (dataSourceConfigs[source as keyof typeof dataSourceConfigs].columns) {
                    dataSourceConfigs[source as keyof typeof dataSourceConfigs].columns.forEach(col => {
                        newColumnConfigs[source][col.key] = true;
                    });
                }
            } else {
                newColumnConfigs[source] = columnConfigs[source];
            }
        });
        setColumnConfigs(newColumnConfigs);
    }, [selectedSources]);
    
    const handleSourceToggle = (source: string) => {
        const isExclusive = source === 'situatie-cantitativ-valorica';
        if (isExclusive) {
            setSelectedSources(prev => prev.includes(source) ? [] : [source]);
        } else {
            setSelectedSources(prev => {
                const newSelection = prev.filter(s => s !== 'situatie-cantitativ-valorica');
                if (newSelection.includes(source)) {
                    return newSelection.filter(s => s !== source);
                } else {
                    return [...newSelection, source];
                }
            });
        }
    };

    const handleColumnToggle = (source: string, columnKey: string) => {
        setColumnConfigs(prevConfigs => ({
            ...prevConfigs,
            [source]: {
                ...prevConfigs[source],
                [columnKey]: !prevConfigs[source]?.[columnKey]
            }
        }));
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const sourcesToFetch = isSpecialReport ? ['intrari-magazie', 'materii-prime'] : selectedSources;
            const fetchPromises = sourcesToFetch.map(async (source) => {
                const config = dataSourceConfigs[source as keyof typeof dataSourceConfigs];
                if (!config.endpoint) return { source, data: [] };

                const response = await fetch(config.endpoint, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    mode: 'cors',
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP ${response.status}: ${response.statusText}. ${errorText}`);
                }
                
                const responseData = await response.json();
                
                let processedData;
                if (Array.isArray(responseData)) {
                    processedData = responseData;
                } else if (responseData.data && Array.isArray(responseData.data)) {
                    processedData = responseData.data;
                } else if (responseData.content && Array.isArray(responseData.content)) {
                    processedData = responseData.content;
                } else {
                    processedData = [];
                }
                
                return { source, data: processedData };
            });

            const results = await Promise.all(fetchPromises);
            const newData: {[key: string]: any[]} = {};
            
            results.forEach(({ source, data }) => {
                newData[source] = data;
            });

            setData(newData);
            
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError('Failed to fetch data: ' + errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    const getNestedValue = (obj: any, path: string) => {
        try {
            return path.split('.').reduce((current, key) => {
                if (current === null || current === undefined) return null;
                return current[key];
            }, obj);
        } catch (error) {
            return null;
        }
    };

    const prepareSituatieStocuri = () => {
        const intrareMagazie = data['intrari-magazie'] || [];
        const materiiPrime = data['materii-prime'] || [];
        
        const filteredIntrari = intrareMagazie.filter(item => {
            const dataAchizitie = getNestedValue(item, 'id.dataAchizitie');
            if (!startDate || !endDate || !dataAchizitie) return true;
            
            const itemDate = new Date(dataAchizitie);
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            return itemDate >= start && itemDate <= end;
        });

        const stocuriMap = new Map();

        filteredIntrari.forEach(intrare => {
            const codIngredient = getNestedValue(intrare, 'id.codIngredient') || '';
            const cantitate = getNestedValue(intrare, 'cantitate') || 0;
            const cantitateFolosita = getNestedValue(intrare, 'cantitateFolosita') || 0;
            const pretAchizitie = getNestedValue(intrare, 'pretAchizitie') || 0;
            const numeIngredient = getNestedValue(intrare, 'numeIngredient') || '';
            
            const cantitateRamasa = cantitate - cantitateFolosita;
            
            if (!stocuriMap.has(codIngredient)) {
                stocuriMap.set(codIngredient, {
                    codArticol: codIngredient,
                    denumireArticol: numeIngredient,
                    um: 'KG',
                    cantitateRamasa: 0,
                    preturi: [],
                    valoare: 0,
                    gestiune: '32'
                });
            }
            
            const item = stocuriMap.get(codIngredient);
            item.cantitateRamasa += cantitateRamasa;
            item.preturi.push(pretAchizitie);
            item.valoare += cantitateRamasa * pretAchizitie;
        });

        materiiPrime.forEach(materie => {
            const codArticol = getNestedValue(materie, 'codArticol') || '';
            if (!stocuriMap.has(codArticol) && getNestedValue(materie, 'stoculActualTotal')) {
                const gestiune = getNestedValue(materie, 'gestiune') || '32';
                stocuriMap.set(codArticol, {
                    codArticol: codArticol,
                    denumireArticol: getNestedValue(materie, 'denumire') || '',
                    um: getNestedValue(materie, 'um') || 'KG',
                    cantitateRamasa: getNestedValue(materie, 'stoculActualTotal') || 0,
                    preturi: [getNestedValue(materie, 'pretMateriePrima') || 0],
                    valoare: (getNestedValue(materie, 'stoculActualTotal') || 0) * (getNestedValue(materie, 'pretMateriePrima') || 0),
                    gestiune: gestiune
                });
            }
        });

        return Array.from(stocuriMap.values()).filter(item => item.cantitateRamasa > 0);
    };

    const prepareExportData = () => {
        const combinedData: any[] = [];
        
        if (isSpecialReport) {
            const situatieData = prepareSituatieStocuri();
            
            if (situatieData.length > 0) {
                const headerInfo = {
                    'Nr. Crt.': 'UNIVERSITATEA TEHNICA DIN CLUJ-NAPOCA',
                    'Cod Articol': `Situatia cantitativ-valorica a stocurilor la data ${new Date().toLocaleDateString('ro-RO')}`,
                    'Denumire Articol': '', 'UM': '', 'Cantitate': '', 'Pret': '', 'Valoare': ''
                };
                combinedData.push(headerInfo);
                const firstItem = situatieData[0];
                if (firstItem.gestiune) {
                    const gestiuneInfo = {
                        'Nr. Crt.': `Gestiune: ${firstItem.gestiune} - CANTINA MARASTI`,
                        'Cod Articol': '', 'Denumire Articol': '', 'UM': '', 'Cantitate': '', 'Pret': '', 'Valoare': ''
                    };
                    combinedData.push(gestiuneInfo);
                }
                const columnHeaders = {
                    'Nr. Crt.': 'Nr. Crt.', 'Cod Articol': 'Cod Articol', 'Denumire Articol': 'Denumire Articol',
                    'UM': 'UM', 'Cantitate': 'Cantitate', 'Pret': 'Pret', 'Valoare': 'Valoare'
                };
                combinedData.push(columnHeaders);
            }

            situatieData.forEach((item, index) => {
                const cantitateRamasa = item.cantitateRamasa || 0;
                const preturiString = item.preturi.map((p: number) => p.toFixed(4)).join(' / ');
                const valoare = item.valoare || 0;
                const exportItem = {
                    'Nr. Crt.': (index + 1).toString(),
                    'Cod Articol': item.codArticol || '',
                    'Denumire Articol': item.denumireArticol || '',
                    'UM': item.um || '',
                    'Cantitate': cantitateRamasa.toFixed(3),
                    'Pret': preturiString,
                    'Valoare': valoare.toFixed(2)
                };
                combinedData.push(exportItem);
            });
            const totalValue = situatieData.reduce((sum, item) => sum + (item.valoare || 0), 0);
            const totalRow = {
                'Nr. Crt.': '', 'Cod Articol': 'Total gestiune:', 'Denumire Articol': '32 - CANTINA MARASTI',
                'UM': '', 'Cantitate': '', 'Pret': '', 'Valoare': totalValue.toFixed(2)
            };
            combinedData.push(totalRow);
            const grandTotalRow = {
                'Nr. Crt.': '', 'Cod Articol': 'Total general:', 'Denumire Articol': '',
                'UM': '', 'Cantitate': '', 'Pret': '', 'Valoare': totalValue.toFixed(2)
            };
            combinedData.push(grandTotalRow);
            
        } else {
            selectedSources.forEach(source => {
                const sourceData = data[source] || [];
                const sourceConfig = dataSourceConfigs[source as keyof typeof dataSourceConfigs];
                const activeColumns = sourceConfig.columns.filter(col => columnConfigs[source]?.[col.key]);

                sourceData.forEach(item => {
                    const exportItem: any = { _source: sourceConfig.name };
                    activeColumns.forEach(col => {
                        const value = getNestedValue(item, col.key);
                        exportItem[col.label] = value !== null && value !== undefined ? value : '';
                    });
                    combinedData.push(exportItem);
                });
            });
        }
        
        return combinedData;
    };

    const generatePreview = () => {
        const exportData = prepareExportData();
        setPreviewData(exportData.slice(0, 10));
        setShowPreview(true);
    };

    const exportToCSV = (data: any[]) => {
        if (data.length === 0) return;

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => {
                    const value = row[header] ?? '';
                    const stringValue = String(value);
                    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                        return '"' + stringValue.replace(/"/g, '""') + '"';
                    }
                    return stringValue;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };

    const exportToExcel = (data: any[], _: 'xlsx' | 'xls') => {
        if (data.length === 0) return;
        exportToCSV(data);
    };

    const exportToPDF = async (data: any[]) => {
        if (data.length === 0) return;

        const printContent = `
            <html>
                <head>
                    <title>Situatia Cantitativ-Valorica</title>
                    <style>
                        table { border-collapse: collapse; width: 100%; font-size: 12px; }
                        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
                        th { background-color: #f2f2f2; font-weight: bold; }
                        body { font-family: Arial, sans-serif; }
                        h1 { color: #333; }
                    </style>
                </head>
                <body>
                    <table>
                        <thead>
                            <tr>
                                ${Object.keys(data[0]).map(key => `<th>${key}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(row => `
                                <tr>
                                    ${Object.values(row).map(value => `<td>${value ?? ''}</td>`).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
            }, 250);
        }
    };

    const handleExport = () => {
        const exportData = prepareExportData();
        
        if (exportData.length === 0) {
            setError('No data to export');
            return;
        }

        try {
            switch (exportFormat) {
                case 'csv':
                    exportToCSV(exportData);
                    break;
                case 'xlsx':
                    exportToExcel(exportData, 'xlsx');
                    break;
                case 'xls':
                    exportToExcel(exportData, 'xls');
                    break;
                case 'pdf':
                    exportToPDF(exportData);
                    break;
            }
        } catch (exportError) {
            setError(`Export failed: ${exportError instanceof Error ? exportError.message : 'Unknown error'}`);
        }
    };

    return (
        <div className="p-6">
            <div className="bg-white rounded-xl shadow-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800">Export Date</h1>
                    <p className="text-gray-600 mt-2">
                        Selecteaza sursa de date si configureaza optiunile pentru export
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Selecteaza Sursa de Date</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(dataSourceConfigs).map(([key, config]) => {
                                const isExclusive = key === 'situatie-cantitativ-valorica';
                                return (
                                    <label
                                        key={key}
                                        className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        {isExclusive ? (
                                            <input
                                                type="radio"
                                                name="exclusiveSource"
                                                checked={selectedSources.includes(key)}
                                                onChange={() => handleSourceToggle(key)}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <input
                                                type="checkbox"
                                                checked={selectedSources.includes(key)}
                                                onChange={() => handleSourceToggle(key)}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                        )}
                                        <div className="ml-3 flex items-center">
                                            {config.icon}
                                            <span className="ml-2 text-sm font-medium text-gray-900">{config.name}</span>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {isSpecialReport ? (
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Perioada Export</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Data Inceput
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={e => setStartDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Data Sfarsit
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={e => setEndDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        selectedSources.length > 0 && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Configureaza Coloanele</h3>
                                <div className="space-y-6">
                                    {selectedSources.map(source => {
                                        const config = dataSourceConfigs[source as keyof typeof dataSourceConfigs];
                                        return (
                                            <div key={source} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-medium text-gray-800 flex items-center">
                                                        {config.icon}
                                                        <span className="ml-2">{config.name}</span>
                                                    </h4>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => {
                                                                const newConfig = { ...columnConfigs };
                                                                config.columns.forEach(col => {
                                                                    newConfig[source][col.key] = true;
                                                                });
                                                                setColumnConfigs(newConfig);
                                                            }}
                                                            className="text-sm text-blue-600 hover:text-blue-800"
                                                        >
                                                            Selecteaza Tot
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const newConfig = { ...columnConfigs };
                                                                config.columns.forEach(col => {
                                                                    newConfig[source][col.key] = false;
                                                                });
                                                                setColumnConfigs(newConfig);
                                                            }}
                                                            className="text-sm text-gray-600 hover:text-gray-800"
                                                        >
                                                            Deselecteaza Tot
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                    {config.columns.map(column => (
                                                        <label key={column.key} className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={columnConfigs[source]?.[column.key] || false}
                                                                onChange={() => handleColumnToggle(source, column.key)}
                                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-700">{column.label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    )}

                    <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
                        <button
                            onClick={fetchData}
                            disabled={loading || selectedSources.length === 0}
                            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <Database className="w-4 h-4" />
                            )}
                            {loading ? 'Se incarca...' : 'Incarca Date'}
                        </button>

                        {(isSpecialReport && data['intrari-magazie'] && data['materii-prime']) || (!isSpecialReport && Object.keys(data).length > 0) ? (
                            <>
                                <button
                                    onClick={generatePreview}
                                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                                >
                                    <Eye className="w-4 h-4" />
                                    Previzualizare
                                </button>

                                <button
                                    onClick={handleExport}
                                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                                >
                                    <Download className="w-4 h-4" />
                                    Export {exportFormat.toUpperCase()}
                                </button>
                            </>
                        ) : null}
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="text-red-700 font-medium">Error:</div>
                            <div className="text-red-600 mt-1">{error}</div>
                        </div>
                    )}

                    {showPreview && previewData.length > 0 && (
                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-800">Previzualizare Date</h3>
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="overflow-x-auto bg-gray-50 rounded-lg">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            {Object.keys(previewData[0]).map(key => (
                                                <th key={key} className="px-4 py-2 text-left font-medium text-gray-700">
                                                    {key}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewData.map((row, index) => (
                                            <tr key={index} className="border-t border-gray-200">
                                                {Object.values(row).map((value: any, cellIndex) => (
                                                    <td key={cellIndex} className="px-4 py-2 text-gray-600">
                                                        {value?.toString() || ''}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {Object.keys(data).length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-medium text-blue-800 mb-2">Sumar Date:</h4>
                            <div className="text-sm text-blue-700">
                                {isSpecialReport ? (
                                    <div>
                                        <div>Perioada: {startDate || 'Nespecificata'} - {endDate || 'Nespecificata'}</div>
                                        <div>Total articole stoc: {prepareSituatieStocuri().length}</div>
                                    </div>
                                ) : (
                                    Object.entries(data).map(([source, items]) => (
                                        <div key={source}>{dataSourceConfigs[source as keyof typeof dataSourceConfigs].name}: {items.length} inregistrari</div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Export;