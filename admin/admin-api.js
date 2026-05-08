/* ===== ADMIN API HELPER ===== */

// Dev: npx serve runs on :3000, backend on :5275 → use full URL
// Prod: same origin → relative URL
const API_BASE = window.location.port === '3000' ? 'http://localhost:5275' : '';

async function apiCall(method, path, body = null) {
    const token = localStorage.getItem('adminToken');
    const opts = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };
    if (token) opts.headers['Authorization'] = `Bearer ${token}`;
    if (body !== null) opts.body = JSON.stringify(body);

    let res;
    try {
        res = await fetch(API_BASE + path, opts);
    } catch {
        throw new Error('Sunucuya bağlanılamadı. Lütfen bağlantınızı kontrol edin.');
    }

    if (res.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminTokenExpiry');
        window.location.href = 'login.html';
        return null;
    }

    if (res.status === 204) return null;

    let data;
    try { data = await res.json(); } catch { data = null; }

    if (!res.ok) {
        const msg = data?.error || data?.message || data?.title || `HTTP ${res.status}`;
        throw new Error(msg);
    }

    return data;
}

function apiGet(path)             { return apiCall('GET',    path); }
function apiPost(path, body)      { return apiCall('POST',   path, body); }
function apiPut(path, body)       { return apiCall('PUT',    path, body); }
function apiDelete(path)          { return apiCall('DELETE', path); }
