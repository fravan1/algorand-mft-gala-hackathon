import styles from './Card.module.css';
import { ReactNode } from 'react';

interface CardProps {
    children?: ReactNode;
    onClick?: () => void;
    className?: string;
    hoverable?: boolean;
}

export default function Card({ 
    children, 
    onClick, 
    className = '', 
    hoverable = true 
}: CardProps) {
    return (
        <div 
            className={`${styles.card} ${hoverable ? styles.hoverable : ''} ${className}`}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {children}
        </div>
    )
}