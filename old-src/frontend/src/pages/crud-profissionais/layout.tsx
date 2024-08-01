import { Box, AppBar, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';

type LayoutProps = {
    children: ReactNode;
};

const headerStyle = {
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
};

export default function DashboardLayout ({ children }: LayoutProps) {
    const route = useRouter();

    return (
        <>
            <AppBar position="sticky" elevation={2}>
                <Box sx={headerStyle}>
                    <Typography variant="h6">Dashboard | Profissionais</Typography>
                    <Button variant="text" style={{color: 'white'}} onClick={()=>route.push('/')}>Sair</Button>
                </Box>
            </AppBar>
            <main>
                <Box p={2}>
                    {children}
                </Box>
            </main>
        </>
    );
};
