'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from './firebase';
import { logger } from './utils';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        logger.info('Auth', 'Initializing auth listener');

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false); // Critical: Prevents auth loop
            console.log('Auth user >>> :', user);
            logger.info('Auth', `Auth state changed: ${user ? 'authenticated' : 'unauthenticated'}`);
        });

        return () => {
            unsubscribe();
            logger.info('Auth', 'Auth listener cleanup');
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            logger.info('Auth', 'Sign in attempt', { email });
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            logger.error('Auth', 'Sign in failed', error);
            throw error;
        }
    };

    const signUp = async (email: string, password: string) => {
        try {
            logger.info('Auth', 'Sign up attempt', { email });
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            logger.error('Auth', 'Sign up failed', error);
            throw error;
        }
    };

    const handleSignOut = async () => {
        try {
            logger.info('Auth', 'Sign out attempt');
            await signOut(auth);
        } catch (error) {
            logger.error('Auth', 'Sign out failed', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut: handleSignOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};