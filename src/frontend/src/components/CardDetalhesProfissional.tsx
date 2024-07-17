import { Box, Typography, Divider, cardActionAreaClasses } from "@mui/material";
import { Profissional } from "../pages/crud-profissionais/types";

function CardDetalhesProfissional({ profissional }: { profissional: Profissional }) {
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

export default CardDetalhesProfissional;