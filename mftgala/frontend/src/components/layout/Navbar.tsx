"use client"

import styles from './Navbar.module.css';
import Link from "next/link";
import ConnectWallet from '../provider/ConnectWallet';
import Button from '../ui/Button';
import { useState } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import { BsCheckCircleFill } from 'react-icons/bs';

export default function Navbar() {
    const [openModal, setOpenModal] = useState(false);
    const { activeAddress } = useWallet();

    const closeModal = () => {
        setOpenModal(false);
    }

    const openModalFn = () => {
        setOpenModal(true);
    }

    return(
        <nav className={styles.navContainer}>
            <Link href="/" className={styles.navLogo}>
                <img
                    src="/logo-mft.svg"
                    alt="MFT-GALA logo"
                    style={{ width: '150px', height: '100px' }}
                />
            </Link>
            <div className={styles.navLinks}>
                <Link href="/"><span className="text-lg font-bold">home</span></Link>
                <Link href="/marketplace"><span className="text-lg font-bold">marketplace</span></Link>
                <Link href="/publish"><span className="text-lg font-bold">publish</span></Link>
                {activeAddress ? (
                    <Link href="/portfolio">
                            <div className="flex items-center gap-2">
                                <span>Portfolio</span>
                            </div>
                    </Link>
                ) : (
                    <ConnectWallet openModal={openModal} closeModal={closeModal} openModalFn={openModalFn} />
                )}
            </div>
        </nav>
    )
}