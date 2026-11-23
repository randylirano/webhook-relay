// k6 ingest benchmark. Placeholder until POST /events exists (build plan step 12).
import http from 'k6/http';
import { check } from 'k6';

const BASE = __ENV.BASE_URL || 'http://localhost:3000';

export const options = { vus: 1, iterations: 1 };

export default function () {
  check(http.get(`${BASE}/healthz`), { 'healthz 200': (r) => r.status === 200 });
}
