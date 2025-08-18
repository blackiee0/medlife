import CryptoJS from 'crypto-js';
import QRCode from 'qrcode';

// Nepal-specific utilities
export const generateNepaliId = () => `NP-${Math.floor(100000 + Math.random() * 900000)}`;

export const validateNationalId = (id: string): boolean => {
  // Nepal National ID format validation (simplified)
  const nepaliIdPattern = /^\d{10}$/;
  return nepaliIdPattern.test(id);
};

export const validateMobileNumber = (mobile: string): boolean => {
  // Nepal mobile number format validation
  const nepaliMobilePattern = /^(98|97)\d{8}$/;
  return nepaliMobilePattern.test(mobile.replace(/[^\d]/g, ''));
};

export const formatNepaliDate = (date: string): string => {
  // Convert to Nepali date format (simplified)
  const d = new Date(date);
  return d.toLocaleDateString('ne-NP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const generateQRCode = async (data: any): Promise<string> => {
  try {
    const qrString = await QRCode.toDataURL(JSON.stringify(data));
    return qrString;
  } catch (error) {
    console.error('QR Code generation failed:', error);
    return '';
  }
};

export const encryptData = (data: string, key: string): string => {
  return CryptoJS.AES.encrypt(data, key).toString();
};

export const decryptData = (encryptedData: string, key: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const generateAuditLog = (
  userId: string,
  userType: string,
  action: string,
  patientId: string,
  details: string
) => ({
  id: `AUDIT-${Date.now()}`,
  timestamp: new Date().toISOString(),
  userId,
  userType,
  action,
  patientId,
  details,
  ipAddress: 'localhost', // In real app, get actual IP
  location: 'Nepal' // In real app, get actual location
});

export const isOnline = (): boolean => {
  return navigator.onLine;
};

export const saveOfflineData = (key: string, data: any): void => {
  localStorage.setItem(`offline_${key}`, JSON.stringify(data));
};

export const getOfflineData = (key: string): any => {
  const data = localStorage.getItem(`offline_${key}`);
  return data ? JSON.parse(data) : null;
};

export const formatBloodGroup = (group: string): string => {
  if (!group) return 'N/A';
  const parts = group.split('');
  let formatted = parts[0];
  if (parts.length > 1) {
    formatted += ' ';
    if (parts[1] === '+') {
      formatted += 'Positive';
    } else if (parts[1] === '-') {
      formatted += 'Negative';
    }
  }
  return formatted;
};

export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export const searchPatients = (patients: any[], filters: any) => {
  return patients.filter(patient => {
    if (filters.name && !patient.name.toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }
    if (filters.nationalId && patient.nationalId !== filters.nationalId) {
      return false;
    }
    if (filters.patientId && patient.id !== filters.patientId) {
      return false;
    }
    if (filters.contact && patient.contact !== filters.contact) {
      return false;
    }
    if (filters.bloodGroup && patient.bloodGroup !== filters.bloodGroup) {
      return false;
    }
    if (filters.sex && patient.sex !== filters.sex) {
      return false;
    }
    return true;
  });
};

export const sortByDate = (items: any[], field: string, order: 'asc' | 'desc' = 'desc') => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a[field]);
    const dateB = new Date(b[field]);
    return order === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
  });
};

export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
