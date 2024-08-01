import DashboardLayout from "./layout"
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { Box, Typography, Paper, Divider, Fab } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridAddIcon, GridCellEditStopParams, GridColDef, GridRowId, GridRowModel, GridRowModes, GridRowModesModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { ToastsList } from "../../components/ToastsList";
import { Profissional } from "./types";
import CardDetalhesProfissional from "../../components/CardDetalhesProfissional";
import TabelaProfissionais from "@/components/TabelaProfissionais";

const initialRows = [
    { id: 1, nome: 'João', email: 'joao@gmail.com', telefone: '123456789', especialidade: 'Cardiologista' },
    { id: 2, nome: 'Maria', email: 'maria@gmail.com', telefone: '987654321', especialidade: 'Dermatologista' },
    { id: 3, nome: 'José', email: 'jose@gmail.com', telefone: '123456789', especialidade: 'Ortopedista' },
    { id: 4, nome: 'Ana', email: 'ana@gmail.com', telefone: '987654321', especialidade: 'Pediatra' },
]

function getRowModel({modes, handleEditClick, handleDeleteClick, handleSaveClick, handleCancelClick} : {modes: GridRowModesModel, handleEditClick: (id: GridRowId) => () => void, handleDeleteClick: (id: GridRowId) => () => void, handleSaveClick: (id: GridRowId) => () => void, handleCancelClick: (id: GridRowId) => () => void}): GridColDef[] {
    const viewRowModel: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'nome', headerName: 'Nome', width: 150, editable: true },
        { field: 'email', headerName: 'E-mail', width: 150, editable: true },
        { field: 'telefone', headerName: 'Telefone', width: 150, editable: true },
        { field: 'especialidade', headerName: 'Especialidade', width: 150, editable: true },
        { field: 'actions', type: 'actions', headerName: 'Ações', width: 100, cellClassName: 'actions',
            getActions: ({ id } : {id: GridRowId}) => {
                const isInEditMode = modes[id]?.mode === GridRowModes.Edit;
        
                if (isInEditMode) {
                  return [
                    <GridActionsCellItem
                      icon={<SaveIcon />}
                      label="Save"
                      sx={{
                        color: 'primary.main',
                      }}
                      onClick={handleSaveClick(id)}
                    />,
                    <GridActionsCellItem
                      icon={<CancelIcon />}
                      label="Cancel"
                      className="textPrimary"
                      onClick={handleCancelClick(id)}
                      color="inherit"
                    />,
                  ];
                }
        
                return [
                  <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    className="textPrimary"
                    onClick={handleEditClick(id)}
                    color="inherit"
                  />,
                  <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={handleDeleteClick(id)}
                    color="inherit"
                  />,
                ];
            },
        },
    ];

    return viewRowModel;
}

export default function PageCrudProfissionais () {
    const [rows, setRows] = useState<Profissional[]>(initialRows)
    const [selectedProfissional, setSelectedProfissional] = useState<Profissional | null>(null)
    const [checkboxSelection, setCheckboxSelection] = useState(false)
    const [alertas, setAlertas] = useState<{mensagem: string, tipo: 'success' | 'error' | 'warning' | 'info'}[]>([])
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
        const updatedRows = rows.map((row) =>
            row.id === newRow.id ? {...newRow, isNew: false} : row
        )
        setRows(updatedRows as Profissional[])
        if (selectedProfissional && selectedProfissional.id === newRow.id) {
            setSelectedProfissional(newRow as Profissional)
        }
        return newRow
    }

    const handleAddProfissional = () => {
        if (rows.find((row) => row.isNew)) {
            setAlertas(prev => [...prev, {mensagem: 'Preencha os campos do profissional antes de adicionar um novo', tipo: 'error', onClose: (index:number)=>removerAlerta(index)}]);
            return;
        }

        const newId = Math.max(...rows.map((row) => row.id)) + 1
        const newProfissional = { id: newId, nome: '', email: '', telefone: '', especialidade: '', isNew: true }
        setRows([...rows, newProfissional])
    }

    const removerAlerta = (index: number) => {
        setAlertas(prevAlertas => prevAlertas.filter((_, i) => i !== index))
    }

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    }
    
    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    }

    const handleDeleteClick = (id: GridRowId) => () => {
        setRows(rows.filter((row) => row.id !== id));
    }

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);

        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const currentColumns = getRowModel({
        modes: rowModesModel,
        handleEditClick,
        handleDeleteClick,
        handleSaveClick,
        handleCancelClick: handleCancelClick
    });

    return (
        <DashboardLayout>
            <ToastsList alertas={alertas} />
            <Box display={'flex'} flexDirection={'row'} gap={2}>
                <Paper sx={{flex:7, overflow:'auto', height:600, position: 'relative'}}>
                    <TabelaProfissionais
                        rows={rows}
                        currentColumns={currentColumns}
                        rowModesModel={rowModesModel}
                        setSelectedProfissional={setSelectedProfissional}
                        checkboxSelection={checkboxSelection}
                        handleAddProfissional={handleAddProfissional}
                        handleRowModesModelChange={handleRowModesModelChange}
                        processRowUpdate={processRowUpdate}
                    />
                </Paper>

                <Paper sx={{flex:3}}>
                    <CardDetalhesProfissional profissional={selectedProfissional ?? { id: 0, nome: '', email: '', telefone: '', especialidade: '' }} />
                </Paper>
            </Box>
        </DashboardLayout>
    )
}