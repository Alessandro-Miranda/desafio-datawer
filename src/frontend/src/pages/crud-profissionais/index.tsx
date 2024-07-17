import DashboardLayout from "./layout"
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { Box, Typography, Paper, Divider, Fab, Alert, Snackbar } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridAddIcon, GridCellEditStopParams, GridColDef, GridRowId, GridRowModel, GridRowModes, GridRowModesModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { z } from "zod";

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

const profissionalSchema = z.object({
    id: z.number(),
    nome: z.string(),
    email: z.string(),
    telefone: z.string(),
    especialidade: z.string(),
    isNew: z.optional(z.boolean()),
})

type viewProfissionalProps = z.infer<typeof profissionalSchema>

function VisualizacaoDetalhadaProfissional({ profissional }: { profissional: viewProfissionalProps }) {
    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom>
                Detalhes do Profissional
            </Typography>
            <Divider />
            <Box mt={2}>
                <Typography variant="body1">
                    <strong>Nome:</strong> {profissional.nome}
                </Typography>
                <Typography variant="body1">
                    <strong>E-mail:</strong> {profissional.email}
                </Typography>
                <Typography variant="body1">
                    <strong>Telefone:</strong> {profissional.telefone}
                </Typography>
                <Typography variant="body1">
                    <strong>Especialidade:</strong> {profissional.especialidade}
                </Typography>
            </Box>
        </Box>
    );
}

function Toast({mensagem, tipo, onClose}:{mensagem: string, tipo: 'success' | 'error' | 'warning' | 'info', onClose?: () => void}) {
    return (
        <Snackbar open autoHideDuration={6000}>
            <Alert severity={tipo} onClose={onClose}>{mensagem}</Alert>
        </Snackbar>
    );
}
function ToastsList({alertas}:{alertas: {mensagem: string, tipo: 'success' | 'error' | 'warning' | 'info', onClose?: (index: number) => void}[]}) {
    return (
        <>
            {alertas.map((alerta, index) => (
                <Toast key={index} mensagem={alerta.mensagem} tipo={alerta.tipo} onClose={alerta.onClose ? ()=>alerta.onClose!(index) : undefined} />
            ))}
        </>
    )
}

export default function PageCrudProfissionais () {
    const [rows, setRows] = useState<z.infer<typeof profissionalSchema>[]>(initialRows)
    const [selectedProfissional, setSelectedProfissional] = useState<viewProfissionalProps | null>(null)
    const [checkboxSelection, setCheckboxSelection] = useState(false)
    const [alertas, setAlertas] = useState<{mensagem: string, tipo: 'success' | 'error' | 'warning' | 'info'}[]>([])
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
        const updatedRows = rows.map((row) =>
            row.id === newRow.id ? {...newRow, isNew: false} : row
        )
        setRows(updatedRows as z.infer<typeof profissionalSchema>[])
        if (selectedProfissional && selectedProfissional.id === newRow.id) {
            setSelectedProfissional(newRow as viewProfissionalProps)
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
                    <Box sx={{position: 'absolute', bottom: 64, right: 32, display:'flex', gap: 1}}>
                        <Fab variant="extended" size="large" color="primary" aria-label="add" onClick={handleAddProfissional}>
                            <GridAddIcon />
                            <Typography variant="button">INCLUIR NOVO</Typography>
                        </Fab>
                        <Fab variant="extended" size="large" color="warning" aria-label="add" onClick={()=>console.log('funcinoalidade em desenvolvimento')}>
                            <Typography variant="button">Salvar Tudo</Typography>
                        </Fab>
                    </Box>
                    <DataGrid
                        rows={rows}
                        columns={currentColumns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 15 },
                            },
                        }}
                        pageSizeOptions={[15, 50, 100]}
                        checkboxSelection={checkboxSelection}
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={handleRowModesModelChange}
                        editMode="row"
                        onRowClick={
                            (row) => {
                                console.log(row)
                                setSelectedProfissional(row.row as viewProfissionalProps)
                            }
                        }
                        processRowUpdate={processRowUpdate}
                    />
                </Paper>

                <Paper sx={{flex:3}}>
                    <VisualizacaoDetalhadaProfissional profissional={selectedProfissional ?? { id: 0, nome: '', email: '', telefone: '', especialidade: '' }} />
                </Paper>
            </Box>
        </DashboardLayout>
    )
}