import { ApiError } from './ApiError.js';

export function parseDateOnly(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) throw new ApiError(400, '올바른 날짜를 입력해 주세요.');
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new ApiError(400, '올바른 날짜를 입력해 주세요.');
  }
  return date;
}

export function calculateNights(checkIn, checkOut) {
  const nights = (parseDateOnly(checkOut) - parseDateOnly(checkIn)) / 86400000;
  if (nights <= 0) throw new ApiError(400, '체크아웃 날짜는 체크인 날짜 이후여야 합니다.');
  return nights;
}

