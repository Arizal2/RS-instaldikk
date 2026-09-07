import { Student, ClinicalInstructor, Visitor, AttendanceRecord, AttendanceStatus, ShiftType } from '../types';

/**
 * Generates a secure, non-plain-NIM token for attendance QR code
 */
export function generateStudentAttendanceToken(studentId: string, nim: string): string {
  const timestamp = Date.now().toString(36);
  const salt = Math.random().toString(36).substring(2, 7);
  // Structured secure token
  return `RSKH-ATT-${studentId.toUpperCase()}-${timestamp}-${salt}`;
}

export function generateCIQrToken(ciId: string, nip: string): string {
  const timestamp = Date.now().toString(36);
  const salt = Math.random().toString(36).substring(2, 6);
  return `RSKH-CI-${ciId.toUpperCase()}-${timestamp}-${salt}`;
}

export function generateVisitorPassToken(visitorId: string): string {
  const timestamp = Date.now().toString(36);
  const salt = Math.random().toString(36).substring(2, 6);
  return `RSKH-VISITOR-${visitorId.toUpperCase()}-${timestamp}-${salt}`;
}

/**
 * Calculates work / practice duration between two HH:mm strings
 */
export function calculateDuration(checkIn: string, checkOut: string): string {
  if (!checkIn || !checkOut) return '-';
  const [h1, m1] = checkIn.split(':').map(Number);
  const [h2, m2] = checkOut.split(':').map(Number);
  
  let totalMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);
  if (totalMinutes < 0) {
    // Cross midnight shift
    totalMinutes += 24 * 60;
  }
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return `${hours.toString().padStart(2, '0')} Jam ${minutes.toString().padStart(2, '0')} Menit`;
}

/**
 * Determines attendance status based on check-in time and shift
 */
export function determineAttendanceStatus(checkInTime: string, shift: ShiftType): AttendanceStatus {
  if (!checkInTime) return 'Tidak Hadir';
  const [h, m] = checkInTime.split(':').map(Number);
  const minutes = h * 60 + m;

  // Standard Shift RSKH:
  // Pagi: 07:00 (Tolerance until 07:15)
  // Siang: 14:00 (Tolerance until 14:15)
  // Malam: 21:00 (Tolerance until 21:15)
  if (shift === 'Pagi') {
    if (minutes > 7 * 60 + 15) return 'Terlambat';
    return 'Hadir';
  } else if (shift === 'Siang') {
    if (minutes > 14 * 60 + 15) return 'Terlambat';
    return 'Hadir';
  } else if (shift === 'Malam') {
    if (minutes > 21 * 60 + 15) return 'Terlambat';
    return 'Hadir';
  }
  return 'Hadir';
}
