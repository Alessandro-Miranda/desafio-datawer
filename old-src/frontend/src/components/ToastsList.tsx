import { Toast } from "./Toast";

export function ToastsList({ alertas }: { alertas: { mensagem: string; tipo: 'success' | 'error' | 'warning' | 'info'; onClose?: (index: number) => void; }[]; }) {
    return (
        <>
            {alertas.map((alerta, index) => (
                <Toast key={index} mensagem={alerta.mensagem} tipo={alerta.tipo} onClose={alerta.onClose ? () => alerta.onClose!(index) : undefined} />
            ))}
        </>
    );
}
