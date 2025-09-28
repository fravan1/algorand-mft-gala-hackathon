import styles from './Button.module.css';
import { ReactNode } from 'react';

interface ButtonProps {
    children?: ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: 'buy' | 'sell';
    disabled?: boolean;
    [key: string]: any;
}

export default function Button({ children, onClick, className = '', variant = 'buy', disabled = false, ...props }: ButtonProps) {
    return (
        <button className={`${styles.button} ${styles[variant]} ${className}`} onClick={onClick} disabled={disabled} {...props}>
            {children}
        </button>
    )
}