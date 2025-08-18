export interface Patient {
  id: string;
  nationalId: string;
  name: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  address: string;
  contact: string;
  email?: string;
  fingerprint?: string;
  allergies: string[];
  medications: string[];
  chronicDiseases: string[];
  implants: string[];
  emergencyContacts: EmergencyContact[];
  reports: MedicalReport[];
  timeline: MedicalTimelineEntry[];
  password: string;
  photo: string;
  qrCode?: string;
  consentSettings: ConsentSettings;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  name: string;
  relation: string;
  number: string;
  email?: string;
}

export interface MedicalReport {
  id: string;
  hospital: string;
  doctor: string;
  date: string;
  type: 'Lab' | 'Imaging' | 'Prescription' | 'Diagnosis' | 'Other';
  fileName: string;
  fileUrl: string;
  description?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface MedicalTimelineEntry {
  id: string;
  date: string;
  type: 'Diagnosis' | 'Treatment' | 'Medication' | 'Lab' | 'Imaging' | 'Surgery' | 'Consultation';
  title: string;
  description: string;
  doctor: string;
  hospital: string;
  attachments?: string[];
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  contact: string;
  email: string;
  nmc_number: string; // Nepal Medical Council Number
  password: string;
  permissions: DoctorPermissions;
}

export interface DoctorPermissions {
  canViewAllPatients: boolean;
  canEditPatientData: boolean;
  canAccessEmergencyData: boolean;
  canGenerateReports: boolean;
}

export interface ConsentSettings {
  allowEmergencyAccess: boolean;
  allowDataSharing: boolean;
  allowResearch: boolean;
  dataRetentionPeriod: number; // in years
  sharedWith: string[]; // doctor/hospital IDs
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userType: 'Patient' | 'Doctor' | 'Admin' | 'Emergency';
  action: string;
  patientId: string;
  details: string;
  ipAddress?: string;
  location?: string;
}

export interface EmergencyAccess {
  patientId: string;
  accessedBy: string;
  timestamp: string;
  reason: string;
  duration: number; // in minutes
  dataAccessed: string[];
}

export interface Referral {
  id: string;
  fromDoctor: string;
  toDoctor: string;
  patientId: string;
  reason: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Emergency';
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Completed';
  createdAt: string;
  notes?: string;
}

export interface OfflineData {
  patients: Patient[];
  lastSync: string;
  pendingChanges: any[];
  syncStatus: 'synced' | 'pending' | 'error';
}

export interface SearchFilters {
  name?: string;
  nationalId?: string;
  patientId?: string;
  contact?: string;
  bloodGroup?: string;
  age?: { min: number; max: number };
  sex?: string;
  hospital?: string;
  doctor?: string;
  dateRange?: { start: string; end: string };
}

export interface SystemSettings {
  language: 'en' | 'ne';
  theme: 'light' | 'dark';
  offlineMode: boolean;
  autoSync: boolean;
  emergencyAccessEnabled: boolean;
  auditLogRetention: number; // in days
}
