import React from 'react';
import { Globe, Server, ShieldAlert, Cpu, AlertCircle, MapPin } from 'lucide-react';

const HostGeoCard = ({ result }) => {
  if (!result) return null;

  const hostType = result.host_type || (result.is_ip_host ? 'IP' : 'DOMAIN');
  const ipAddress = result.ip_address || result.extracted_features?.geo_info?.ip_address || 'Not Applicable';
  const country = result.country || result.extracted_features?.geo_info?.country || 'Unknown';
  const asn = result.asn || result.extracted_features?.geo_info?.asn || 'Unknown';
  const isp = result.isp || result.extracted_features?.geo_info?.isp || 'Unknown';
  const registeredDomain = result.registered_domain || result.extracted_features?.registered_domain || result.domain || 'N/A';
  const geoAnomaly = result.geo_anomaly ?? result.extracted_features?.geo_anomaly ?? false;
  const ipReputation = result.ip_reputation || result.extracted_features?.ip_reputation || 'UNKNOWN';
  const detectionReasons = result.detection_reasons || result.reasons || [];

  return (
    <div style={{
      background: 'rgba(5, 8, 22, 0.6)',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid var(--border-muted)',
      marginTop: '24px',
      marginBottom: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Globe size={20} color="var(--accent-cyan)" />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
            HOST & GEO INTELLIGENCE
          </h4>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="sample-pill" style={{ textTransform: 'uppercase', fontWeight: 700, fontSize: '0.75rem', background: hostType.includes('IP') ? 'rgba(255, 171, 0, 0.15)' : 'rgba(0, 217, 255, 0.15)', color: hostType.includes('IP') ? 'var(--status-warning)' : 'var(--accent-cyan)' }}>
            HOST: {hostType}
          </span>
          <span className="sample-pill" style={{ textTransform: 'uppercase', fontWeight: 700, fontSize: '0.75rem', background: geoAnomaly ? 'rgba(255, 8, 68, 0.2)' : 'rgba(0, 230, 118, 0.15)', color: geoAnomaly ? 'var(--status-danger)' : 'var(--status-safe)' }}>
            GEO ANOMALY: {geoAnomaly ? 'YES' : 'NO'}
          </span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>Host Type</p>
          <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{hostType}</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>IP Address</p>
          <p style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', margin: 0 }}>{ipAddress}</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>Country</p>
          <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{country}</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>Registered Domain</p>
          <p style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-main)', margin: 0 }}>{registeredDomain}</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>ASN</p>
          <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{asn}</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>ISP / Provider</p>
          <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{isp}</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>IP Reputation</p>
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '4px',
            background: ipReputation === 'HIGH' ? 'rgba(255, 8, 68, 0.2)' : ipReputation === 'MEDIUM' ? 'rgba(255, 171, 0, 0.2)' : 'rgba(0, 230, 118, 0.2)',
            color: ipReputation === 'HIGH' ? 'var(--status-danger)' : ipReputation === 'MEDIUM' ? 'var(--status-warning)' : 'var(--status-safe)'
          }}>
            {ipReputation}
          </span>
        </div>
      </div>

      {detectionReasons && detectionReasons.length > 0 && (
        <div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>
            Identity & Network Detection Reasons:
          </p>
          <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {detectionReasons.map((reason, idx) => (
              <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HostGeoCard;
