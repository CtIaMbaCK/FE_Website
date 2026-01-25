'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RewardsPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/socialorg/rewards/comments');
  }, [router]);

  return (
    <div className="p-6">
      <p>Đang chuyển hướng...</p>
    </div>
  );
}
