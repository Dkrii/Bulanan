import { useState, useEffect } from 'react';

export function useDeviceId() {
    const [deviceId, setDeviceId] = useState<string | null>(null);

    useEffect(() => {
        // Client-side only
        if (typeof window !== 'undefined') {
            let id = localStorage.getItem('finance_device_id');
            if (!id) {
                id = crypto.randomUUID();
                localStorage.setItem('finance_device_id', id);
            }
            setDeviceId(id);
        }
    }, []);

    return deviceId;
}
