import { useState, useEffect } from 'react';

const EPOCH_MS = 1704067200000; 
const KM_PER_AU = 149597870.7;
const V1_BASE_KM = 24300000000; 
const V1_SPEED_KMS = 17.0; 
const V2_BASE_KM = 20400000000; 
const V2_SPEED_KMS = 15.3;

export const useVoyager = () => {
  const [telemetry, setTelemetry] = useState({ v1: { km: 0, au: 0 }, v2: { km: 0, au: 0 } });

  useEffect(() => {
    const calculateDistances = () => {
      const seconds = (Date.now() - EPOCH_MS) / 1000;
      const v1Km = V1_BASE_KM + (seconds * V1_SPEED_KMS);
      const v2Km = V2_BASE_KM + (seconds * V2_SPEED_KMS);
      setTelemetry({
        v1: { km: Math.floor(v1Km), au: (v1Km / KM_PER_AU).toFixed(6) },
        v2: { km: Math.floor(v2Km), au: (v2Km / KM_PER_AU).toFixed(6) }
      });
    };
    calculateDistances();
    const interval = setInterval(calculateDistances, 100);
    return () => clearInterval(interval);
  }, []);

  return telemetry;
};