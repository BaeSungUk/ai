import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { calculateNights, parseDateOnly } from '../utils/date.js';

describe('application contract', () => {
  it('returns a consistent health response', async () => {
    const response = await request(createApp()).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, message: 'StayHub API가 정상 작동 중입니다.', data: { status: 'ok' } });
  });

  it('returns JSON for unknown routes', async () => {
    const response = await request(createApp()).get('/missing');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ success: false, message: '요청한 경로를 찾을 수 없습니다.' });
  });
});

describe('date-only reservation rules', () => {
  it('calculates nights without local timezone drift', () => {
    expect(calculateNights('2026-08-10', '2026-08-13')).toBe(3);
  });

  it('rejects an invalid calendar date', () => {
    expect(() => parseDateOnly('2026-02-30')).toThrow('올바른 날짜를 입력해 주세요.');
  });
});
