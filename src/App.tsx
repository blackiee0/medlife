import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AdminLogin from './components/Portals/AdminLogin';




// --- Type Definitions ---
interface Patient {
  id: string;
  password: string;
  name: string;
  age: number;
  bloodGroup: string;
  allergies: string[];
  chronicDiseases: string[];
  emergencyContact: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  address: string;
  phone: string;
  email: string;
  reports: Array<{
    id: string;
    date: string;
    hospital: string;
    title: string;
    description: string;
    doctor: string;
    url: string;
    status: 'pending' | 'completed' | 'urgent';
  }>;
  photoUrl: string;
  hospital: string;
  implants: string[];
  abnormalities: string[];
  lastUpdated: string;
  emergencyContacts: EmergencyContact[];
}

interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
  priority: number;
}

interface Doctor {
  id: string;
  password: string;
  name: string;
  hospital: string;
  specialty: string;
  subSpecialty: string;
  licenseNumber: string;
  phone: string;
  email: string;
  photoUrl: string;
  experience: number;
  education: string;
  certifications: string[];
  availability: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };
  lastUpdated: string;
}

interface Admin {
  id: string;
  password: string;
  name: string;
  hospital: string;
}

interface Toast {
  message: string;
  type: 'success' | 'error';
}

// --- Data Simulation ---
// Initial mock data for the application.
// This data will be stored in localStorage.
const initialData = {
  patients: [
    {
      id: 'P001',
      password: 'patient',
      name: 'Alice Johnson',
      age: 45,
      bloodGroup: 'A+',
      allergies: ['Penicillin'],
      chronicDiseases: ['Hypertension'],
      emergencyContact: 'Bob Johnson',
      emergencyContactRelation: 'Spouse',
      emergencyContactPhone: '555-1234',
      address: '123 Pine St, Anytown, USA',
      phone: '555-1111',
      email: 'alice.johnson@email.com',
      reports: [
        { 
          id: 'R001',
          date: '2023-01-15', 
          hospital: 'General Hospital', 
          title: 'Blood Work Report',
          description: 'Complete blood count and chemistry panel',
          doctor: 'Dr. Emily White',
          url: 'https://placehold.co/400x300/4F46E5/FFFFFF?text=Report+1',
          status: 'completed'
        },
        { 
          id: 'R002',
          date: '2023-03-22', 
          hospital: 'General Hospital', 
          title: 'X-Ray Scan',
          description: 'Chest X-ray for respiratory assessment',
          doctor: 'Dr. Emily White',
          url: 'https://placehold.co/400x300/4F46E5/FFFFFF?text=Report+2',
          status: 'completed'
        },
        { 
          id: 'R003',
          date: '2023-04-10', 
          hospital: 'General Hospital', 
          title: 'MRI Scan',
          description: 'Brain MRI for neurological evaluation',
          doctor: 'Dr. Emily White',
          url: 'https://placehold.co/400x300/4F46E5/FFFFFF?text=Report+3',
          status: 'completed'
        },
      ],
      photoUrl: 'https://placehold.co/100x100/4F46E5/FFFFFF?text=P1',
      hospital: 'General Hospital',
      implants: ['Dental Crown'],
      abnormalities: ['Slight heart murmur'],
      lastUpdated: '2024-01-15',
      emergencyContacts: [
        {
          name: 'Bob Johnson',
          relation: 'Spouse',
          phone: '555-1234',
          priority: 1
        },
        {
          name: 'Diane Johnson',
          relation: 'Sister',
          phone: '555-5678',
          priority: 2
        }
      ]
    },
    {
      id: 'P002',
      password: 'patient',
      name: 'Charlie Davis',
      age: 62,
      bloodGroup: 'O-',
      allergies: ['Dust'],
      chronicDiseases: ['Diabetes'],
      emergencyContact: 'Diane Davis',
      emergencyContactRelation: 'Daughter',
      emergencyContactPhone: '555-5678',
      address: '456 Oak St, Anytown, USA',
      phone: '555-2222',
      email: 'charlie.davis@email.com',
      reports: [
        { 
          id: 'R004',
          date: '2023-05-10', 
          hospital: 'City Medical Center', 
          title: 'ECG Report',
          description: 'Electrocardiogram for cardiac assessment',
          doctor: 'Dr. Mark Green',
          url: 'https://placehold.co/400x300/4F46E5/FFFFFF?text=Report+A',
          status: 'completed'
        },
      ],
      photoUrl: 'https://placehold.co/100x100/4F46E5/FFFFFF?text=P2',
      hospital: 'City Medical Center',
      implants: ['Hip Replacement'],
      abnormalities: ['Type 2 Diabetes'],
      lastUpdated: '2024-01-10',
      emergencyContacts: [
        {
          name: 'Diane Davis',
          relation: 'Daughter',
          phone: '555-5678',
          priority: 1
        },
        {
          name: 'Alice Davis',
          relation: 'Wife',
          phone: '555-8765',
          priority: 2
        }
      ]
    },
  ] as Patient[],
  doctors: [
    {
      id: 'D001',
      password: 'doctor',
      name: 'Dr. Emily White',
      hospital: 'General Hospital',
      specialty: 'Cardiology',
      subSpecialty: 'Interventional Cardiology',
      licenseNumber: 'MD12345',
      phone: '555-3333',
      email: 'emily.white@hospital.com',
      photoUrl: 'https://placehold.co/100x100/059669/FFFFFF?text=D1',
      experience: 15,
      education: 'Harvard Medical School',
      certifications: ['Board Certified Cardiologist', 'Fellowship in Interventional Cardiology'],
      availability: {
        monday: { start: '08:00', end: '17:00', available: true },
        tuesday: { start: '08:00', end: '17:00', available: true },
        wednesday: { start: '08:00', end: '17:00', available: true },
        thursday: { start: '08:00', end: '17:00', available: true },
        friday: { start: '08:00', end: '17:00', available: true },
        saturday: { start: '09:00', end: '13:00', available: false },
        sunday: { start: '09:00', end: '13:00', available: false },
      },
      lastUpdated: '2024-01-15',
    },
    {
      id: 'D002',
      password: 'doctor',
      name: 'Dr. Mark Green',
      hospital: 'City Medical Center',
      specialty: 'Orthopedics',
      subSpecialty: 'Joint Replacement',
      licenseNumber: 'MD67890',
      phone: '555-4444',
      email: 'mark.green@hospital.com',
      photoUrl: 'https://placehold.co/100x100/059669/FFFFFF?text=D2',
      experience: 12,
      education: 'Stanford Medical School',
      certifications: ['Board Certified Orthopedic Surgeon', 'Fellowship in Joint Replacement'],
      availability: {
        monday: { start: '07:00', end: '18:00', available: true },
        tuesday: { start: '07:00', end: '18:00', available: true },
        wednesday: { start: '07:00', end: '18:00', available: true },
        thursday: { start: '07:00', end: '18:00', available: true },
        friday: { start: '07:00', end: '18:00', available: true },
        saturday: { start: '08:00', end: '14:00', available: true },
        sunday: { start: '08:00', end: '14:00', available: false },
      },
      lastUpdated: '2024-01-12',
    },
  ] as Doctor[],
  admin: [
    {
      id: 'A001',
      password: 'admin',
      name: 'Admin General',
      hospital: 'General Hospital',
    },
    {
      id: 'A002',
      password: 'admin',
      name: 'Admin City',
      hospital: 'City Medical Center',
    }
  ] as Admin[],
};

// --- Contexts ---
interface MedLifeContextType {
  currentUser: Patient | Doctor | Admin | null;
  patients: Patient[];
  doctors: Doctor[];
  role: string | null;
  addPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
  addDoctor: (doctor: Doctor) => void;
  updateDoctor: (doctor: Doctor) => void;
  deletePatient: (id: string) => void;
  deleteDoctor: (id: string) => void;
  updatePatientData: (patient: Patient) => void;
  confirmLogout: () => void;
  login: (id: string, password: string, userRole: string) => boolean;
  setToast: (toast: Toast | null) => void;
}

const MedLifeContext = createContext<MedLifeContextType | undefined>(undefined);

// --- Custom Hook for Safe Context Usage ---
export const useMedLifeContext = () => {
  const context = useContext(MedLifeContext);
  if (context === undefined) {
    throw new Error('useMedLifeContext must be used within a MedLifeProvider');
  }
  return context;
};

// --- MedLifeProvider Component ---
const MedLifeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [currentUser, setCurrentUser] = useState<Patient | Doctor | Admin | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Clear localStorage to ensure fresh data
    localStorage.removeItem('medlifePatients');
    localStorage.removeItem('medlifeDoctors');
    localStorage.removeItem('medlifeAdmins');
    
    // Set initial data
    setPatients(initialData.patients);
    setDoctors(initialData.doctors);
    setAdmins(initialData.admin);
    
    console.log('Initial data loaded:', {
      patients: initialData.patients.length,
      doctors: initialData.doctors.length,
      admins: initialData.admin.length
    });
  }, []);




  const login = (id: string, password: string, userRole: string) => {
    console.log('Login attempt:', { id, password, userRole });
    console.log('Available data:', { 
      patients: patients.length, 
      doctors: doctors.length, 
      admins: admins.length 
    });
    
    let user: Patient | Doctor | Admin | null = null;
    if (userRole === 'patient') {
      user = patients.find(p => p.id === id && p.password === password) || null;
      console.log('Patient search result:', user);
    } else if (userRole === 'doctor') {
      user = doctors.find(d => d.id === id && d.password === password) || null;
      console.log('Doctor search result:', user);
    } else if (userRole === 'admin') {
      user = admins.find(a => a.id === id && a.password === password) || null;
      console.log('Admin search result:', user);
    }

    if (user) {
      console.log('Login successful:', user);
      setCurrentUser(user);
      setRole(userRole);
      return true;
    }
    console.log('Login failed: no user found');
    return false;
  };

  const confirmLogout = () => {
    setCurrentUser(null);
    setRole(null);
  };

  
  
  const updatePatientData = (updatedUser: Patient) => {
    setPatients(patients.map(p => p.id === updatedUser.id ? updatedUser : p));
    setCurrentUser(updatedUser);
  };
  
  const updatePatient = (updatedPatient: Patient) => {
    setPatients(patients.map(p => p.id === updatedPatient.id ? updatedPatient : p));
  };
  
  const addPatient = (newPatient: Patient) => {
    setPatients([...patients, newPatient]);
  };
  
  const updateDoctor = (updatedDoctor: Doctor) => {
    setDoctors(doctors.map(d => d.id === updatedDoctor.id ? updatedDoctor : d));
  };

  const addDoctor = (newDoctor: Doctor) => {
    setDoctors([...doctors, newDoctor]);
  };
  
  const deletePatient = (id: string) => {
    setPatients(patients.filter(p => p.id !== id));
  };
  
  const deleteDoctor = (id: string) => {
    setDoctors(doctors.filter(d => d.id !== id));
  };

  const contextValue = {
    patients,
    doctors,
    admins,
    currentUser,
    role,
    login,
    updatePatientData,
    updatePatient,
    addPatient,
    updateDoctor,
    addDoctor,
    deletePatient,
    deleteDoctor,
    setToast: () => {},
    confirmLogout,
  };

  return (
    <MedLifeContext.Provider value={contextValue}>
      {children}
    </MedLifeContext.Provider>
  );
};

// --- Reusable Components ---
// Main application button component with styling variants.
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }: ButtonProps) => {
  const baseClasses = 'w-full sm:w-auto font-semibold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100';
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 active:bg-indigo-800',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 active:bg-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800',
    outline: 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500 active:bg-indigo-100',
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {children}
    </button>
  );
};

// Main card component for consistent UI sections.
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverActions?: React.ReactNode;
}

const Card = ({ children, className = '', hoverActions }: CardProps) => (
  <div className={`bg-white rounded-2xl shadow-xl p-4 sm:p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative group ${className}`}>
    {children}
    {hoverActions && (
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
        {hoverActions}
      </div>
    )}
  </div>
);

// Generic Modal component for popups.
interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
}

const Modal = ({ children, onClose, title = '' }: ModalProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Add escape key handler and focus trap
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    // Focus trap implementation
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (!focusableElements || focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    };

    // Set initial focus to first focusable element
    const firstFocusable = modalRef.current?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;
    if (firstFocusable) {
      firstFocusable.focus();
    }

    document.addEventListener('keydown', handleTabKey);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match the transition duration
  };

  return (
    <div
      ref={modalRef}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`w-full max-w-xl bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold" id="modal-title">{title}</h3>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-800 transition p-2 rounded-full hover:bg-gray-100"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

// Confirmation Modal for critical actions.
interface ConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal = ({ title, message, onConfirm, onCancel }: ConfirmationModalProps) => {
  return (
    <Modal onClose={onCancel} title={title}>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex justify-end space-x-4">
        <Button onClick={onCancel} variant="secondary">Cancel</Button>
        <Button onClick={onConfirm} variant="danger">Confirm</Button>
      </div>
    </Modal>
  );
};

// Toast notification for non-critical feedback.
interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {
  const [progress, setProgress] = useState(100);
  const color = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = type === 'success'
    ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
      
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    // Progress bar animation
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(progressTimer);
          return 0;
        }
        return prev - 5;
      });
    }, 150);
    
    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [onClose]);

  return (
    <div className={`fixed bottom-8 right-8 z-50 p-4 rounded-xl text-white shadow-lg ${color} animate-fade-in transform transition-all duration-300`}>
      <div className="flex items-start space-x-2">
        <div className="flex-shrink-0 pt-0.5">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 inline-flex text-white hover:text-gray-200 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="mt-2 w-full bg-white bg-opacity-30 rounded-full h-1.5">
        <div
          className="bg-white h-1.5 rounded-full transition-all duration-150 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

// --- Theme and Language Context ---
interface ThemeAndLanguageContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: 'en' | 'ne';
  toggleLanguage: () => void;
  translations: Record<string, Record<string, string>>;
}

const ThemeAndLanguageContext = createContext<ThemeAndLanguageContextType | undefined>(undefined);

// Create theme provider component
const ThemeAndLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ne'>('en');

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    document.documentElement.classList.toggle('dark');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ne' : 'en');
  };

  // Basic translations
  const translations = {
    en: {
      login: 'Login',
      register: 'Register',
      emergency: 'Emergency',
      // Add more translations
    },
    ne: {
      login: 'लग इन',
      register: 'दर्ता गर्नुहोस्',
      emergency: 'आपतकालीन',
      // Add more translations
    }
  };

  return (
    <ThemeAndLanguageContext.Provider value={{ 
      isDarkMode, 
      toggleDarkMode, 
      language, 
      toggleLanguage,
      translations 
    }}>
      {children}
    </ThemeAndLanguageContext.Provider>
  );
};

// Add logo component
const Logo = () => (
  <div className="flex items-center space-x-2">
    <img 
      src="/medlife-logo.svg" 
      alt="Med-Life Logo" 
      className="h-8 w-auto"
    />
    <span className="font-bold text-xl text-indigo-600 dark:text-indigo-400">
      Med-Life
    </span>
  </div>
);

// Add navigation controls
const NavigationControls = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode, language, toggleLanguage } = useContext(ThemeAndLanguageContext)!;

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => navigate(-1)}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {isDarkMode ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
      <button
        onClick={toggleLanguage}
        className="px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600"
      >
        {language === 'en' ? 'नेपाली' : 'ENG'}
      </button>
    </div>
  );
};

// Update Header component
const Header = () => {
  const { currentUser, role, confirmLogout } = useMedLifeContext();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };
  
  const confirmLogoutAction = () => {
    confirmLogout();
    setShowLogoutConfirm(false);
  };
  
  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <NavigationControls />
          <Logo />
        </div>
        {currentUser && (
          <div className="flex items-center space-x-4">
            <span className="text-sm dark:text-gray-300 hidden sm:inline transition-colors duration-300">
              {currentUser.name} ({role})
            </span>
            <Button onClick={handleLogout} variant="secondary" className="py-1 px-3 text-sm">
              Logout
            </Button>
          </div>
        )}
      </div>
      
      {showLogoutConfirm && (
        <ConfirmationModal
          title="Confirm Logout"
          message="Are you sure you want to logout?"
          onConfirm={confirmLogoutAction}
          onCancel={cancelLogout}
        />
      )}
    </header>
  );
};

// --- Portals (Views) ---
const PatientPortal = () => {
  const { currentUser, updatePatientData, setToast: contextSetToast } = useMedLifeContext();
  
  // Guard clause to prevent rendering before currentUser is set
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Patient>>({});
  
  // Guard clause to prevent rendering before currentUser is set
  if (!currentUser || !('reports' in currentUser)) {
    return <div>Loading...</div>;
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveChanges = () => {
    if (currentUser && 'id' in currentUser) {
      const updatedUser = { ...currentUser, ...formData };
      updatePatientData(updatedUser);
      setIsEditing(false);
      contextSetToast({ message: 'Profile updated successfully!', type: 'success' });
    }
  };

  const recentReports = currentUser.reports.slice(-2); // Get the last two reports

  return (
    <div className="p-4 sm:p-8 space-y-8">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <span>Home</span> / <span>Patient</span> / <span>{currentUser.name}</span>
      </div>
      
      <Card className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
        {currentUser.photoUrl ? (
          <img src={currentUser.photoUrl} alt="User" className="w-24 h-24 rounded-full object-cover border-4 border-indigo-600 shadow-md" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-indigo-600 shadow-md">
            {currentUser.name.charAt(0)}
          </div>
        )}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-800">{currentUser.name}</h2>
          <p className="text-gray-500 mt-1">Patient ID: <span className="font-mono text-indigo-600">{currentUser.id}</span></p>
          <div className="mt-4 flex flex-wrap justify-center md:justify-start items-center space-x-4">
            <span className="text-sm font-semibold bg-blue-100 text-blue-800 py-1 px-3 rounded-full">Age: {currentUser.age}</span>
            <span className="text-sm font-semibold bg-red-100 text-red-800 py-1 px-3 rounded-full">Blood: {currentUser.bloodGroup}</span>
            <span className="text-sm font-semibold bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full">Allergies: {currentUser.allergies.join(', ') || 'None'}</span>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="group">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            My Profile
          </h3>
          <p className="text-gray-600 mb-2"><strong>Contact:</strong> {currentUser.emergencyContact}</p>
          <p className="text-gray-600 mb-2"><strong>Address:</strong> {currentUser.address}</p>
          <p className="text-gray-600"><strong>Chronic Diseases:</strong> {currentUser.chronicDiseases.join(', ') || 'None'}</p>
          <Button onClick={() => setIsEditing(true)} variant="outline" className="mt-4 w-full">Edit Details</Button>
        </Card>

        <Card className="group">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
            Recent Reports
          </h3>
          <ul className="space-y-3">
            {recentReports.length > 0 ? (
              recentReports.map((report, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800 truncate">{report.title}</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      report.status === 'completed' ? 'bg-green-100 text-green-800' :
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </div>
                  <Button onClick={() => window.open(report.url, '_blank')} variant="primary" className="py-1 px-3 text-sm">View</Button>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No reports found.</p>
            )}
          </ul>
        </Card>

        <Card className="group">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            Notifications
          </h3>
          <ul className="space-y-3">
            <li className="text-gray-700">Your MRI report was added on 2023-04-10.</li>
            <li className="text-gray-700">Upcoming appointment with Dr. Emily White on Oct 25.</li>
            <li className="text-gray-700">Remember to renew your medication.</li>
          </ul>
        </Card>
      </div>
      
      <Card className="space-y-6 group">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
          All Medical Reports
        </h3>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="text"
            placeholder="Search reports..."
            className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          <select className="p-3 border border-gray-300 rounded-lg shadow-sm">
            <option>All Types</option>
            <option>Blood Work</option>
            <option>Scans</option>
            <option>ECG</option>
          </select>
        </div>
        <ul className="space-y-4">
          {currentUser.reports.map((report, index) => (
            <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="font-medium text-gray-800">{report.title}</span>
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    report.status === 'completed' ? 'bg-green-100 text-green-800' :
                    report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{report.date} • {report.hospital}</p>
              </div>
              <Button onClick={() => window.open(report.url, '_blank')} variant="primary" className="py-1 px-3 text-sm">View</Button>
            </li>
          ))}
        </ul>
      </Card>
      
      {/* Edit Profile Modal */}
      {isEditing && (
        <Modal onClose={() => setIsEditing(false)} title="Edit Profile">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || currentUser.name}
                onChange={handleEditChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || currentUser.phone}
                onChange={handleEditChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="text"
                name="email"
                value={formData.email || currentUser.email}
                onChange={handleEditChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address || currentUser.address}
                onChange={handleEditChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <Button onClick={() => setIsEditing(false)} variant="secondary">Cancel</Button>
              <Button onClick={saveChanges} variant="primary">Save Changes</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// --- DoctorPortal Component ---
const DoctorPortal = () => {
  const { currentUser, patients } = useMedLifeContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  if (!currentUser || !('specialty' in currentUser)) {
    return <div>Loading...</div>;
  }

  const filteredPatients = patients.filter(p =>
    p.hospital === currentUser.hospital &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 space-y-8">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <span>Home</span> / <span>Doctor</span> / <span>{currentUser.name}</span>
      </div>
      
      <Card className="flex flex-col sm:flex-row items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          Doctor Dashboard - {currentUser.name}
        </h2>
        <div className="text-sm text-gray-600">
          {currentUser.specialty} • {currentUser.hospital}
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800">Patient Search</h3>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search patients..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map(patient => (
            <div key={patient.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow group">
              <div className="flex items-center space-x-3 mb-3">
                {patient.photoUrl ? (
                  <img src={patient.photoUrl} alt={patient.name} className="w-12 h-12 rounded-full" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                    {patient.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-semibold">{patient.name}</h4>
                  <p className="text-sm text-gray-600">ID: {patient.id}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">Age: {patient.age} • Blood: {patient.bloodGroup}</p>
              <Button
                onClick={() => setSelectedPatient(patient)}
                variant="outline"
                className="w-full"
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {selectedPatient && (
        <Modal onClose={() => setSelectedPatient(null)} title="Patient Details">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {selectedPatient.photoUrl ? (
                <img src={selectedPatient.photoUrl} alt={selectedPatient.name} className="w-24 h-24 rounded-full" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                  {selectedPatient.name.charAt(0)}
                </div>
              )}
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-bold">{selectedPatient.name}</h3>
                <p className="text-gray-600">Patient ID: {selectedPatient.id}</p>
                <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">Age: {selectedPatient.age}</span>
                  <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">Blood: {selectedPatient.bloodGroup.replace('+', ' positive')}</span>
                  <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded">Allergies: {selectedPatient.allergies.join(', ') || 'None'}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h4 className="text-lg font-bold text-gray-800 mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Phone:</strong> {selectedPatient.phone}</p>
                  <p><strong>Email:</strong> {selectedPatient.email}</p>
                  <p><strong>Address:</strong> {selectedPatient.address}</p>
                  <p><strong>Emergency Contact:</strong> {selectedPatient.emergencyContact} ({selectedPatient.emergencyContactRelation}) - {selectedPatient.emergencyContactPhone}</p>
                </div>
              </Card>
              
              <Card>
                <h4 className="text-lg font-bold text-gray-800 mb-3">Medical Information</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Chronic Diseases:</strong> {selectedPatient.chronicDiseases.join(', ') || 'None'}</p>
                  <p><strong>Implants:</strong> {selectedPatient.implants.join(', ') || 'None'}</p>
                  <p><strong>Abnormalities:</strong> {selectedPatient.abnormalities.join(', ') || 'None'}</p>
                </div>
              </Card>
            </div>
            
            <Card>
              <h4 className="text-lg font-bold text-gray-800 mb-3">Medical Reports</h4>
              {selectedPatient.reports.length > 0 ? (
                <div className="space-y-3">
                  {selectedPatient.reports.map((report, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="flex items-center">
                          <h5 className="font-medium">{report.title}</h5>
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                            report.status === 'completed' ? 'bg-green-100 text-green-800' :
                            report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{report.date} • {report.hospital} • Dr. {report.doctor}</p>
                      </div>
                      <Button
                        onClick={() => window.open(report.url, '_blank')}
                        variant="primary"
                        className="mt-2 sm:mt-0 py-1 px-3 text-sm w-full sm:w-auto"
                      >
                        View Report
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No medical reports available.</p>
              )}
            </Card>
          </div>
        </Modal>
      )}
    </div>
  );
};

const AdminPortal = () => {
  const { currentUser, patients, doctors, updatePatient, updateDoctor, deletePatient, deleteDoctor } = useMedLifeContext();

  const [view, setView] = useState('patients');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<{ item: Patient | Doctor; type: string } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: string } | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Guard clause to prevent rendering before currentUser is set
  if (!currentUser) return null;

  const filteredPatients = patients.filter(p => p.hospital === currentUser.hospital && p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredDoctors = doctors.filter(d => d.hospital === currentUser.hospital && d.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleEdit = (item: Patient | Doctor, type: string) => {
    setItemToEdit({ item, type });
    setShowEditModal(true);
  };

  const handleConfirmDelete = (id: string, type: string) => {
    setItemToDelete({ id, type });
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete && itemToDelete.type === 'patient') {
      deletePatient(itemToDelete.id);
      setToast({ message: 'Patient deleted successfully!', type: 'success' });
    } else if (itemToDelete && itemToDelete.type === 'doctor') {
      deleteDoctor(itemToDelete.id);
      setToast({ message: 'Doctor deleted successfully!', type: 'success' });
    }
    setShowConfirmModal(false);
    setItemToDelete(null);
  };

  const saveEdit = (updatedItem: Patient | Doctor) => {
    if (itemToEdit && itemToEdit.type === 'patient') {
      updatePatient(updatedItem as Patient);
      setToast({ message: 'Patient updated successfully!', type: 'success' });
    } else if (itemToEdit && itemToEdit.type === 'doctor') {
      updateDoctor(updatedItem as Doctor);
      setToast({ message: 'Doctor updated successfully!', type: 'success' });
    }
    setShowEditModal(false);
  };

  return (
    <div className="p-4 sm:p-8 space-y-8">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <span>Home</span> / <span>Admin</span> / <span>{currentUser.hospital}</span>
      </div>
      
      <Card className="flex flex-col sm:flex-row items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Admin Dashboard - {currentUser.hospital}</h2>
        <div className="flex space-x-2">
          <Button onClick={() => setView('patients')} variant={view === 'patients' ? 'primary' : 'outline'}>Patients</Button>
          <Button onClick={() => setView('doctors')} variant={view === 'doctors' ? 'primary' : 'outline'}>Doctors</Button>
          <Button onClick={() => setShowAddModal(true)} variant="primary" className="hidden sm:inline-block">
            Add New {view === 'patients' ? 'Patient' : 'Doctor'}
          </Button>
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-800">{view === 'patients' ? 'Patient List' : 'Doctor List'}</h3>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search for ${view === 'patients' ? 'patients' : 'doctors'}...`}
            className="w-full sm:w-auto mt-4 sm:mt-0 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {view === 'patients' ? 'Age' : 'Specialty'}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {view === 'patients' ? 
                filteredPatients.map((item: Patient) => (
                  <tr key={item.id} className="animate-fade-in hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Button onClick={() => handleEdit(item, 'patient')} variant="secondary" className="py-1 px-3">Edit</Button>
                      <Button onClick={() => handleConfirmDelete(item.id, 'patient')} variant="danger" className="py-1 px-3">Delete</Button>
                    </td>
                  </tr>
                ))
              : 
                filteredDoctors.map((item: Doctor) => (
                  <tr key={item.id} className="animate-fade-in hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.specialty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Button onClick={() => handleEdit(item, 'doctor')} variant="secondary" className="py-1 px-3">Edit</Button>
                      <Button onClick={() => handleConfirmDelete(item.id, 'doctor')} variant="danger" className="py-1 px-3">Delete</Button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </Card>
      
      {showAddModal && <AddModal type={view} onSave={() => { setShowAddModal(false); setToast({ message: `${view === 'patients' ? 'Patient' : 'Doctor'} added successfully!`, type: 'success' }); }} onCancel={() => setShowAddModal(false)} />}
      {showEditModal && <EditModal item={itemToEdit} onSave={saveEdit} onCancel={() => setShowEditModal(false)} />}
      {showConfirmModal && itemToDelete && <ConfirmationModal title="Confirm Deletion" message={`Are you sure you want to delete this ${itemToDelete.type}? This action cannot be undone.`} onConfirm={confirmDelete} onCancel={() => setShowConfirmModal(false)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

const AddModal = ({ type, onSave, onCancel }: { type: string; onSave: () => void; onCancel: () => void }) => {
  const { addPatient, addDoctor, currentUser } = useMedLifeContext();
  const [formData, setFormData] = useState<{
    name: string;
    password: string;
    age?: string;
    bloodGroup?: string;
    allergies?: string;
    specialty?: string;
    photoUrl?: string;
  }>({ 
    name: '', 
    password: 'password' 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.password) {
      console.error('Name and Password are required.');
      return;
    }
    if (type === 'patients') {
      const newPatient: Patient = {
        id: `P${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        name: formData.name,
        password: formData.password,
        age: parseInt(formData.age || '0'),
        bloodGroup: formData.bloodGroup || '',
        allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : [],
        chronicDiseases: [],
        emergencyContact: '',
        emergencyContactRelation: '',
        emergencyContactPhone: '',
        address: '',
        phone: '',
        email: '',
        reports: [],
        photoUrl: formData.photoUrl || `https://placehold.co/100x100/4F46E5/FFFFFF?text=New+P`,
        hospital: currentUser?.hospital || 'General Hospital',
        implants: [],
        abnormalities: [],
        lastUpdated: new Date().toISOString().split('T')[0],
        emergencyContacts: []
      };
      addPatient(newPatient);
    } else {
      const newDoctor: Doctor = {
        id: `D${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        name: formData.name,
        password: formData.password,
        hospital: currentUser?.hospital || 'General Hospital',
        specialty: formData.specialty || '',
        subSpecialty: '',
        licenseNumber: '',
        phone: '',
        email: '',
        photoUrl: formData.photoUrl || `https://placehold.co/100x100/059669/FFFFFF?text=New+D`,
        experience: 0,
        education: '',
        certifications: [],
        availability: {
          monday: { start: '08:00', end: '17:00', available: true },
          tuesday: { start: '08:00', end: '17:00', available: true },
          wednesday: { start: '08:00', end: '17:00', available: true },
          thursday: { start: '08:00', end: '17:00', available: true },
          friday: { start: '08:00', end: '17:00', available: true },
          saturday: { start: '09:00', end: '13:00', available: false },
          sunday: { start: '09:00', end: '13:00', available: false },
        },
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      addDoctor(newDoctor);
    }
    onSave();
  };

  return (
    <Modal onClose={onCancel} title={`Add New ${type === 'patients' ? 'Patient' : 'Doctor'}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" name="name" onChange={handleChange} placeholder="Full Name" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input type="text" name="password" onChange={handleChange} value={formData.password} placeholder="Password" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" required />
        </div>
        {type === 'patients' ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input type="number" name="age" onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Blood Group</label>
              <input type="text" name="bloodGroup" onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Allergies (comma separated)</label>
              <input type="text" name="allergies" onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700">Specialty</label>
            <input type="text" name="specialty" onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
        )}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Photo URL</label>
          <input type="text" name="photoUrl" onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-4">
        <Button onClick={onCancel} variant="secondary">Cancel</Button>
        <Button onClick={handleSave} variant="primary">Save</Button>
      </div>
    </Modal>
  );
};

const EditModal = ({ item, onSave, onCancel }: { 
  item: { item: Patient | Doctor; type: string } | null; 
  onSave: (updatedItem: Patient | Doctor) => void; 
  onCancel: () => void 
}) => {
  const [formData, setFormData] = useState<Partial<Patient | Doctor>>(item?.item || {});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (item?.item) {
      const updatedItem = {
        ...item.item,
        ...formData,
        allergies: item?.type === 'patient' && (formData as Partial<Patient>).allergies ? 
          (typeof (formData as Partial<Patient>).allergies === 'string' ? (formData as Partial<Patient>).allergies.split(',').map((a: string) => a.trim()) : []) : 
          (item?.item as Patient)?.allergies || []
      };
      onSave(updatedItem);
    }
  };

  return (
    <Modal onClose={onCancel} title={`Edit ${item?.type === 'patient' ? 'Patient' : 'Doctor'}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input type="text" name="password" value={formData.password || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" required />
        </div>
        {item?.type === 'patient' ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input type="number" name="age" value={(formData as Partial<Patient>).age || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Blood Group</label>
              <input type="text" name="bloodGroup" value={(formData as Partial<Patient>).bloodGroup || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Allergies (comma separated)</label>
              <input type="text" name="allergies" value={Array.isArray((formData as Partial<Patient>).allergies) ? (formData as Partial<Patient>).allergies?.join(', ') : (formData as Partial<Patient>).allergies || ''} onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Photo URL</label>
              <input type="text" name="photoUrl" value={formData.photoUrl || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Specialty</label>
              <input type="text" name="specialty" value={(formData as Partial<Doctor>).specialty || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Photo URL</label>
              <input type="text" name="photoUrl" value={formData.photoUrl || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
          </>
        )}
      </div>
      <div className="mt-6 flex justify-end space-x-4">
        <Button onClick={onCancel} variant="secondary">Cancel</Button>
        <Button onClick={handleSave} variant="primary">Save</Button>
      </div>
    </Modal>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: "🏥",
      title: "Centralized Records",
      description: "Access all your medical records in one secure place"
    },
    {
      icon: "👨‍⚕️",
      title: "Doctor Connect",
      description: "Seamlessly connect with healthcare professionals"
    },
    {
      icon: "🚨",
      title: "Emergency Access",
      description: "Quick access to critical medical information"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative pt-6 pb-16 sm:pb-24">
            <div className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Your Health Records</span>
                  <span className="block text-indigo-600">One Click Away</span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                  Access your medical records, connect with doctors, and manage your health history securely and efficiently.
                </p>
                <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                  <Button onClick={() => navigate('/login')} variant="primary" className="mb-2 sm:mb-0 sm:mr-2">
                    Get Started
                  </Button>
                  <Button onClick={() => navigate('/emergency')} variant="danger">
                    🚨 Emergency Access
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need in one place
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 hover:shadow-lg transition-shadow">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg text-3xl">
                          {feature.icon}
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-indigo-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Trusted by healthcare providers worldwide
            </h2>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200">
                Hospitals
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">100+</dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200">
                Doctors
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">1000+</dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200">
                Patients
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">50k+</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Create your account today.</span>
          </h2>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Button onClick={() => navigate('/register')} variant="primary">
                Register Now
              </Button>
            </div>
            <div className="ml-3 inline-flex">
              <Button onClick={() => navigate('/login')} variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Privacy Policy</span>
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Terms of Service</span>
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Contact</span>
              Contact
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              © {new Date().getFullYear()} MedLife. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- Portals (Emergency View) ---
const EmergencyPortal = () => {
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState('');
  const [fingerprintData, setFingerprintData] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { patients, setToast } = useMedLifeContext();

  const handleFingerprintScan = () => {
    // Simulate fingerprint scanning
    setFingerprintData('fingerprint_scanned_' + Date.now());
    setToast({ message: 'Fingerprint scanned successfully!', type: 'success' });
  };

  const handleSearch = () => {
    if (!patientId.trim()) {
      setError('Please enter a Patient ID');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call delay
    setTimeout(() => {
      const patient = patients.find(p => p.id.toUpperCase() === patientId.toUpperCase());
      
      if (patient) {
        setSelectedPatient(patient);
        setError('');
      } else {
        setError('Patient not found. Please check the ID and try again.');
        setSelectedPatient(null);
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleClose = () => {
    if (selectedPatient) {
      const confirmed = window.confirm('Are you sure you want to close this patient profile? This action cannot be undone.');
      if (confirmed) {
        setSelectedPatient(null);
        setPatientId('');
        setFingerprintData('');
      }
    } else {
      setSelectedPatient(null);
      setPatientId('');
      setFingerprintData('');
    }
  };

  return (
    <div className="fixed inset-0 bg-red-50 dark:bg-red-900 z-50 overflow-auto">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-red-800 dark:text-red-200">Emergency Access</h2>
          <Button onClick={() => navigate('/')} variant="secondary">
            Back to Home
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Patient ID Search */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient Identification</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID</label>
                  <input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    placeholder="Enter Patient ID (e.g., P001)"
                    className="w-full p-3 border-2 border-red-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-lg"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Searching...' : 'Search Patient'}
                </button>
              </div>
            </div>

            {/* Fingerprint Scanner */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Fingerprint Access</h3>
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <div className="w-24 h-24 mx-auto bg-red-200 rounded-full flex items-center justify-center mb-3">
                    <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <button
                    onClick={handleFingerprintScan}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Scan Fingerprint
                  </button>
                  {fingerprintData && (
                    <p className="text-sm text-green-600 mt-2">✓ Fingerprint scanned</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Patient Profile Modal */}
        {selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-800">Patient Profile</h3>
                  <button
                    onClick={handleClose}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Patient Profile Header with Avatar */}
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
                  {selectedPatient.photoUrl ? (
                    <img
                      src={selectedPatient.photoUrl}
                      alt={selectedPatient.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-indigo-600 shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-indigo-600 shadow-md">
                      {selectedPatient.name.charAt(0)}
                    </div>
                  )}
                  <div className="text-center sm:text-left">
                    <h3 className="text-2xl font-bold text-gray-800">{selectedPatient.name}</h3>
                    <p className="text-gray-600">Patient ID: {selectedPatient.id}</p>
                    <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">Age: {selectedPatient.age}</span>
                      <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">Blood: {selectedPatient.bloodGroup.replace('+', ' positive')}</span>
                      <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded">Allergies: {selectedPatient.allergies.join(', ') || 'None'}</span>
                    </div>
                  </div>
                </div>

                {/* Critical Information */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                    <h3 className="text-lg font-semibold text-red-800 mb-3">🚨 CRITICAL INFORMATION</h3>
                    <div className="space-y-2">
                      <p><strong>Blood Group:</strong> {selectedPatient.bloodGroup.replace('+', ' positive')}</p>
                      <p><strong>Allergies:</strong> {selectedPatient.allergies.length > 0 ? selectedPatient.allergies.join(', ') : 'None'}</p>
                      <p><strong>Implants:</strong> {selectedPatient.implants.length > 0 ? selectedPatient.implants.join(', ') : 'None'}</p>
                      <p><strong>Abnormalities:</strong> {selectedPatient.abnormalities.length > 0 ? selectedPatient.abnormalities.join(', ') : 'None'}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">📞 EMERGENCY CONTACT</h3>
                    <div className="space-y-2">
                      <p><strong>Contact:</strong> {selectedPatient.emergencyContact}</p>
                      <p><strong>Relation:</strong> {selectedPatient.emergencyContactRelation}</p>
                      <p><strong>Phone:</strong> {selectedPatient.emergencyContactPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Patient Details */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">👤 PATIENT DETAILS</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p><strong>Hospital:</strong> {selectedPatient.hospital}</p>
                      <p><strong>Phone:</strong> {selectedPatient.phone}</p>
                      <p><strong>Email:</strong> {selectedPatient.email}</p>
                    </div>
                    <div>
                      <p><strong>Address:</strong> {selectedPatient.address}</p>
                      <p><strong>Last Updated:</strong> {selectedPatient.lastUpdated}</p>
                    </div>
                    <div>
                      <p><strong>Chronic Diseases:</strong> {selectedPatient.chronicDiseases.join(', ') || 'None'}</p>
                    </div>
                  </div>
                </div>

                {/* Medical History */}
                <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-3">🏥 MEDICAL HISTORY</h3>
                  <div className="space-y-2">
                    <p><strong>Chronic Diseases:</strong> {selectedPatient.chronicDiseases.length > 0 ? selectedPatient.chronicDiseases.join(', ') : 'None'}</p>
                    <p><strong>Recent Reports:</strong> {selectedPatient.reports.length} reports available</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
















const LoginPage = () => {
  const { login, setToast } = useMedLifeContext();
  const [formData, setFormData] = useState({
    id: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Determine role from ID prefix
    const role = formData.id[0] === 'P' ? 'patient' 
               : formData.id[0] === 'D' ? 'doctor'
               : formData.id[0] === 'A' ? 'admin'
               : null;

    if (!role) {
      setToast({ message: 'Invalid ID format', type: 'error' });
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      const success = login(formData.id, formData.password, role);
      if (success) {
        navigate(`/${role}`);
      } else {
        // Login failed
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <button 
              onClick={() => navigate('/register')} 
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              register for a new account
            </button>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="id" className="sr-only">ID</label>
              <input
                id="id"
                name="id"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="User ID"
                value={formData.id}
                onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              className="group relative w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
        
        <div className="text-center">
          <button
            onClick={() => navigate('/emergency')}
            className="font-medium text-red-600 hover:text-red-500"
          >
            🚨 Emergency Access
          </button>
        </div>
      </div>
    </div>
  );
};

const RegistrationPage = () => {
  const navigate = useNavigate();
  const { addPatient } = useMedLifeContext();
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    age: '',
    bloodGroup: '',
    phone: '',
    email: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Create new patient object
    const newPatient: Patient = {
      id: `P${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      name: formData.name,
      password: formData.password,
      age: parseInt(formData.age),
      bloodGroup: formData.bloodGroup,
      allergies: [],
      chronicDiseases: [],
      emergencyContact: '',
      emergencyContactRelation: '',
      emergencyContactPhone: '',
      address: formData.address,
      phone: formData.phone,
      email: formData.email,
      reports: [],
      photoUrl: `https://placehold.co/100x100/4F46E5/FFFFFF?text=${formData.name[0]}`,
      hospital: 'General Hospital',
      implants: [],
      abnormalities: [],
      lastUpdated: new Date().toISOString().split('T')[0],
      emergencyContacts: []
    };

    // Simulate API call delay
    setTimeout(() => {
      addPatient(newPatient);
              // Registration successful
              navigate('/login');
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create a new account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <button 
              onClick={() => navigate('/login')} 
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              sign in to your existing account
            </button>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>
              
              <div>
                <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">Blood Group</label>
                <input
                  id="bloodGroup"
                  name="bloodGroup"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData(prev => ({ ...prev, bloodGroup: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                id="address"
                name="address"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              className="group relative w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- ProtectedRoute Component ---
const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: string }> = ({ children, role }) => {
  const { currentUser } = useMedLifeContext();
  
  if (!currentUser) {
    // Redirect to role-specific login page if role is specified, otherwise to general login
    return <Navigate to={role ? `/${role}/login` : "/login"} replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  return (
    <BrowserRouter>
      <ThemeAndLanguageProvider>
        <MedLifeProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Header />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPortal /></ProtectedRoute>} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/doctor" element={<ProtectedRoute><DoctorPortal /></ProtectedRoute>} />
              <Route path="/emergency" element={<EmergencyPortal />} />
              <Route path="/patient" element={<ProtectedRoute><PatientPortal /></ProtectedRoute>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </MedLifeProvider>
      </ThemeAndLanguageProvider>
    </BrowserRouter>
  );
};

export default App;

