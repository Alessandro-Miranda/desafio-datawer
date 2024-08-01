import { Snackbar, Alert } from "@mui/material";

export function Toast({ mensagem, tipo, onClose }: { mensagem: string; tipo: 'success' | 'error' | 'warning' | 'info'; onClose?: () => void; }) {
    return (
        <Snackbar open autoHideDuration={6000}>
            <Alert severity={tipo} onClose={onClose}>{mensagem}</Alert>
        </Snackbar>
    );
}
