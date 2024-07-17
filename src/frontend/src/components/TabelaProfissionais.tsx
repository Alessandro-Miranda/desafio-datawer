import { Box, Fab, Typography } from "@mui/material"
import { DataGrid, GridAddIcon, GridColDef, GridRowModel, GridRowModesModel } from "@mui/x-data-grid"
import { Profissional } from "./types"

export default function TabelaProfissionais(
    {rows, currentColumns, checkboxSelection, rowModesModel, handleRowModesModelChange, handleAddProfissional, setSelectedProfissional, processRowUpdate}:
    {   rows: Profissional[],
        currentColumns: GridColDef[],
        checkboxSelection: boolean,
        rowModesModel: GridRowModesModel,
        handleAddProfissional: () => void,
        handleRowModesModelChange: (newRowModesModel: GridRowModesModel) => void,
        setSelectedProfissional: (selected:Profissional) => void,
        processRowUpdate: (newRow: GridRowModel, oldRow: GridRowModel) => GridRowModel
    }) {
        return (
        <>
            <Box sx={{position: 'absolute', bottom: 64, right: 32, display:'flex', gap: 1}}>
                <Fab variant="extended" size="large" color="primary" aria-label="add" onClick={handleAddProfissional}>
                    <GridAddIcon />
                    <Typography variant="button">INCLUIR NOVO</Typography>
                </Fab>
                <Fab variant="extended" size="large" color="warning" aria-label="add" onClick={()=>console.log('funcionalidade em desenvolvimento')}>
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
                        setSelectedProfissional(row.row as Profissional)
                    }
                }
                processRowUpdate={processRowUpdate}
            />
        </>
    )
}