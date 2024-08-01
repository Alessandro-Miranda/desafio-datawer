import styles from '@/../styles/auth.module.css';
import { ReactNode } from 'react';

type LayoutProps = {
    children: ReactNode;
};

export default function AuthLayout({ children }: LayoutProps) {
    return (
        <main className={styles.main}>
            {children}
        </main>
    )
}