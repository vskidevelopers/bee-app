'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/public/Logo';
import { toast } from 'sonner';

export default function LoginPage() {
    const { signIn } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signIn(email, password);
            toast.success('Logged in successfully');
            router.replace('/admin');
        } catch (error: any) {
            const message = error.code === 'auth/invalid-credential'
                ? 'Invalid email or password'
                : error.message || 'Login failed';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-stone-200">
                <div className="text-center mb-6">
                    <Logo className="h-12 w-auto mx-auto" />
                    <h1 className="text-2xl font-bold text-brand-dark mt-4">Admin Access</h1>
                    <p className="text-brand-grey text-sm mt-1">Sign in to manage your store</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-brand-dark mb-1">Email</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e?.target.value)}
                            required
                            placeholder="admin@beehouseholds.co.ke"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brand-dark mb-1">Password</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full border border-[#b88a35] bg-brand-gold hover:bg-[#b88a35] text-[#b88a35] hover:text-white"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>
            </div>
        </div>
    );
}