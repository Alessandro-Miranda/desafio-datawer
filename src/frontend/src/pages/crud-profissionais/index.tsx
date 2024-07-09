import DashboardLayout from "./layout"
import { Box, Typography, Paper, Divider } from "@mui/material";
import { DataGrid, GridCellEditStopParams, GridRowModel } from "@mui/x-data-grid";
import { useState } from "react";
import { z } from "zod";

const initialRows = [
    { id: 1, nome: 'João', email: 'joao@gmail.com', telefone: '123456789', especialidade: 'Cardiologista' },
    { id: 2, nome: 'Maria', email: 'maria@gmail.com', telefone: '987654321', especialidade: 'Dermatologista' },
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

export default function PageCrudProfissionais () {
    const [rows, setRows] = useState<z.infer<typeof profissionalSchema>[]>(initialRows)
    const [selectedProfissional, setSelectedProfissional] = useState<viewProfissionalProps | null>(null)
    const [checkboxSelection, setCheckboxSelection] = useState(false)

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

    return (
        <DashboardLayout>
            <Box display={'flex'} flexDirection={'row'} gap={2}>
                <Paper sx={{flex:7, overflow:'auto', minHeight:600}}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 5 },
                                },
                            }}
                            pageSizeOptions={[5, 10]}
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