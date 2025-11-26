"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/Spinner';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push('/login');
        return;
      }
      // fetch user record
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('id', session.user.id)
        .single();
      if (error) {
        console.error(error);
      }
      setUser(data);
      setLoading(false);
    }
    loadUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="max-w-lg mx-auto bg-white border border-neutral-dark rounded-2xl p-8 shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">معلومات الحساب</h2>
      <div className="space-y-4 text-base">
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">الاسم:</span>
          <span>{user.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">البريد الإلكتروني:</span>
          <span>{user.email}</span>
        </div>
      </div>
    </div>
  );
}