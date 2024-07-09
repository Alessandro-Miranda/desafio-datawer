import DashboardLayout from "./layout"
import { Box, Typography, Paper, Divider, Fab, Alert, Snackbar } from "@mui/material";
import { DataGrid, GridAddIcon, GridCellEditStopParams, GridRowModel } from "@mui/x-data-grid";
import { useState } from "react";
import { z } from "zod";

const initialRows = [
    { id: 1, nome: 'João', email: 'joao@gmail.com', telefone: '123456789', especialidade: 'Cardiologista' },
    { id: 2, nome: 'Maria', email: 'maria@gmail.com', telefone: '987654321', especialidade: 'Dermatologista' },
    { id: 3, nome: 'José', email: 'jose@gmail.com', telefone: '123456789', especialidade: 'Ortopedista' },
    { id: 4, nome: 'Ana', email: 'ana@gmail.com', telefone: '987654321', especialidade: 'Pediatra' },
]

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'nome', headerName: 'Nome', width: 150, editable: true },
    { field: 'email', headerName: 'E-mail', width: 150, editable: true },
    { field: 'telefone', headerName: 'Telefone', width: 150, editable: true },
    { field: 'especialidade', headerName: 'Especialidade', width: 150, editable: true },
]

const profissionalSchema = z.object({
    id: z.number(),
    nome: z.string(),
    email: z.string(),
    telefone: z.string(),
    especialidade: z.string(),
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

    const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
        const updatedRows = rows.map((row) =>
            row.id === newRow.id ? newRow : row
        )
        setRows(updatedRows as z.infer<typeof profissionalSchema>[])
        if (selectedProfissional && selectedProfissional.id === newRow.id) {
            setSelectedProfissional(newRow as viewProfissionalProps)
        }
        return newRow
    }

    const handleAddProfissional = () => {
        if (rows.find((row) => {
                const keys = Object.keys(row).filter((key) => key !== 'id');
                return keys.every((key) => row[key as keyof viewProfissionalProps] === '');
            })
        ) {
            setAlertas(prev => [...prev, {mensagem: 'Preencha os campos do profissional antes de adicionar um novo', tipo: 'warning', onClose: (index:number)=>removerAlerta(index)}]);
            return;
        }

        const newId = Math.max(...rows.map((row) => row.id)) + 1
        const newProfissional = { id: newId, nome: '', email: '', telefone: '', especialidade: '' }
        setRows([...rows, newProfissional])
    }

    const removerAlerta = (index: number) => {
        setAlertas(prevAlertas => prevAlertas.filter((_, i) => i !== index))
    }

    return (
        <DashboardLayout>
            <ToastsList alertas={alertas} />
            <Box display={'flex'} flexDirection={'row'} gap={2}>
                <Paper sx={{flex:7, overflow:'auto', height:600, position: 'relative'}}>
                    <Fab variant="circular" size="medium" color="primary" aria-label="add" sx={{position: 'absolute', bottom: 64, right: 32}} onClick={handleAddProfissional}>
                        <GridAddIcon />
                    </Fab>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 15 },
                            },
                        }}
                        pageSizeOptions={[15, 50, 100]}
                        checkboxSelection={checkboxSelection}
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