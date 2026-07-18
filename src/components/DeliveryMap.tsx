import { useEffect, useState, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Truck, HelpCircle, Key, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

// Retrieve the injected API key
const GOOGLE_MAPS_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidGoogleKey = Boolean(GOOGLE_MAPS_KEY) && GOOGLE_MAPS_KEY.trim() !== '' && GOOGLE_MAPS_KEY !== 'YOUR_API_KEY';

interface DeliveryMapProps {
  customerAddress?: string;
  customerPincode?: string;
  storeLat?: number;
  storeLng?: number;
  onDistanceCalculated?: (distanceVal: number, deliveryInfo: any) => void;
}

export default function DeliveryMap({
  customerAddress = '',
  customerPincode = '',
  storeLat = 16.6618,
  storeLng = 73.5186,
  onDistanceCalculated,
}: DeliveryMapProps) {
  const [addressToGeocode, setAddressToGeocode] = useState(customerAddress);

  useEffect(() => {
    if (customerAddress) {
      setAddressToGeocode(customerAddress + (customerPincode ? `, ${customerPincode}` : ''));
    } else if (customerPincode) {
      setAddressToGeocode(`Pincode ${customerPincode}, Maharashtra, India`);
    }
  }, [customerAddress, customerPincode]);

  return (
    <div className="w-full rounded-2xl border border-slate-100 overflow-hidden shadow-sm bg-white font-sans mt-3">
      {hasValidGoogleKey ? (
        <APIProvider apiKey={GOOGLE_MAPS_KEY} version="weekly">
          <LiveGoogleDeliveryMap
            address={addressToGeocode}
            pincode={customerPincode}
            storeLat={storeLat}
            storeLng={storeLng}
            onDistanceCalculated={onDistanceCalculated}
          />
        </APIProvider>
      ) : (
        <SimulatedDeliveryRouteMap
          customerAddress={customerAddress}
          customerPincode={customerPincode}
          storeLat={storeLat}
          storeLng={storeLng}
          onDistanceCalculated={onDistanceCalculated}
        />
      )}
    </div>
  );
}

// ==========================================
// 🚨 DRAGGABLE & CLICKABLE REAL GOOGLE MAPS
// ==========================================

function LiveGoogleDeliveryMap({
  address,
  storeLat,
  storeLng,
  onDistanceCalculated,
}: {
  address: string;
  pincode: string;
  storeLat: number;
  storeLng: number;
  onDistanceCalculated?: (distance: number, info: any) => void;
}) {
  const map = useMap();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useMapsLibrary('maps');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useMapsLibrary('routes');
  
  const [customerCoords, setCustomerCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);  // Automatically geocode original address on mount/props shift
  useEffect(() => {
    if (!address || !map) return;
    setSearchQuery(address);
    geocodeAddress(address);
  }, [address, map]);

  const geocodeAddress = async (addrStr: string) => {
    if (!map) return;
    setLoading(true);
    
    try {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: addrStr }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
        if (status === 'OK' && results && results[0]) {
          const firstResult = results[0];
          const destCoords = {
            lat: firstResult.geometry.location.lat(),
            lng: firstResult.geometry.location.lng()
          };
          setCustomerCoords(destCoords);
          calculateRoute(destCoords);
        } else {
          throw new Error(`Geocoding status: ${status}`);
        }
      });
    } catch (err: unknown) {
      console.warn('Geocoding search failed, trying default pincode mapping', err);
      setLoading(false);
    }
  };

  const calculateRoute = (dest: { lat: number; lng: number }) => {
    if (!map) return;
    setLoading(true);

    // Clear previous direction lines
    polylinesRef.current.forEach((p: google.maps.Polyline) => p.setMap(null));
    polylinesRef.current = [];

    const directionsService = new google.maps.DirectionsService();
    const routeRequest: google.maps.DirectionsRequest = {
      origin: { lat: storeLat, lng: storeLng },
      destination: dest,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(routeRequest, (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
      if (status === 'OK' && result && result.routes[0]) {
        const leg = result.routes[0].legs[0];
        const km = parseFloat(((leg.distance?.value || 0) / 1000).toFixed(1));
        const durationStr = leg.duration?.text || '';

        const path = result.routes[0].overview_path;
        const polyline = new google.maps.Polyline({
          path: path,
          geodesic: true,
          strokeColor: '#059669', // Emerald 600
          strokeOpacity: 0.8,
          strokeWeight: 4,
        });

        polyline.setMap(map);
        polylinesRef.current.push(polyline);

        // Fit bounds
        const bounds = new google.maps.LatLngBounds();
        bounds.extend({ lat: storeLat, lng: storeLng });
        bounds.extend(dest);
        map.fitBounds(bounds, 50);

        if (onDistanceCalculated) {
          onDistanceCalculated(km, {
            avail: km <= 20,
            formattedDistance: `${km} km`,
            duration: durationStr,
            routeDetails: `Via ${result.routes[0].summary || 'local highways'}`
          });
        }
      } else {
        // Fallback straight-line
        fallbackStraightLine(dest);
      }
      setLoading(false);
    });
  };

  const fallbackStraightLine = (dest: { lat: number; lng: number }) => {
    const R = 6371; // Earth Radius
    const dLat = ((dest.lat - storeLat) * Math.PI) / 180;
    const dLng = ((dest.lng - storeLng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((storeLat * Math.PI) / 180) *
        Math.cos((dest.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const finalKm = parseFloat((R * c).toFixed(1));

    if (map) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: storeLat, lng: storeLng });
      bounds.extend(dest);
      map.fitBounds(bounds, 50);

      const line = new google.maps.Polyline({
        path: [{ lat: storeLat, lng: storeLng }, dest],
        strokeColor: '#ef4444',
        strokeOpacity: 0.8,
        strokeWeight: 3,
      });
      line.setMap(map);
      polylinesRef.current.push(line);
    }

    if (onDistanceCalculated) {
      onDistanceCalculated(finalKm, {
        avail: finalKm <= 20,
        formattedDistance: `${finalKm} km`,
        duration: 'Straight flight distance'
      });
    }
  };

  // Map Click relocation handler
  const handleMapClick = (e: { detail?: { latLng?: { lat: number | (() => number); lng: number | (() => number) } }; latLng?: { lat: () => number; lng: () => number } }) => {
    const latLng = e.detail?.latLng || e.latLng;
    if (!latLng) return;
    const lat = typeof latLng.lat === 'function' ? latLng.lat() : latLng.lat;
    const lng = typeof latLng.lng === 'function' ? latLng.lng() : latLng.lng;
    
    const newCoords = { lat, lng };
    setCustomerCoords(newCoords);
    calculateRoute(newCoords);
  };

  // Drag pin relocation handler
  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const newCoords = { lat, lng };
    setCustomerCoords(newCoords);
    calculateRoute(newCoords);
  };

  return (
    <div className="flex flex-col">
      {/* Dynamic Search Box */}
      <div className="p-3 bg-slate-50 border-b border-slate-100 flex gap-2">
        <input
          type="text"
          value={searchQuery}
          placeholder="Type landmark, street or broad locality (e.g. Rajapur Station)"
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white p-2 text-xs border border-slate-200 rounded-lg flex-1 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => geocodeAddress(searchQuery)}
          className="bg-emerald-800 text-white px-3 py-1 text-xs font-bold rounded-lg hover:bg-emerald-950 shrink-0 cursor-pointer"
        >
          Search Location
        </button>
      </div>

      {/* Actual Map Screen container */}
      <div className="h-[210px] w-full bg-slate-100 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-10">
            <RefreshCw className="h-6 w-6 text-emerald-600 animate-spin" />
            <span className="text-[10px] text-slate-700 font-bold">Querying Google Directions...</span>
          </div>
        )}

        <Map
          defaultCenter={{ lat: storeLat, lng: storeLng }}
          defaultZoom={11}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          onClick={handleMapClick}
          style={{ width: '100%', height: '100%' }}
          gestureHandling="greedy"
          disableDefaultUI={true}
        >
          {/* Main admin Store headquarters marker */}
          <AdvancedMarker position={{ lat: storeLat, lng: storeLng }} title="Village Kitchen Office (Goval Rajapur)">
            <Pin background="#047857" borderColor="#064e3b" glyphColor="#fff">
              <span className="text-[9px] font-black p-0.5 whitespace-nowrap">HQ</span>
            </Pin>
          </AdvancedMarker>

          {/* User delivery marker which is fully draggable */}
          {customerCoords && (
            <AdvancedMarker 
              position={customerCoords} 
              draggable={true} 
              onDragEnd={handleMarkerDragEnd}
              title="Your Address Destination (Drag me!)"
            >
              <Pin background="#ef4444" borderColor="#991b1b" glyphColor="#fff">
                <span className="text-[9px] font-extrabold p-0.5 whitespace-nowrap">DRAG ME</span>
              </Pin>
            </AdvancedMarker>
          )}
        </Map>
      </div>

      {/* Explanatory footer details */}
      <div className="p-3 bg-emerald-50/20 border-t border-slate-100 flex flex-col gap-1 text-[11px] text-slate-600 font-sans">
        <div className="flex items-start gap-1">
          <span className="font-extrabold text-slate-800">Admin Store HQ:</span>
          <span>Village Goval, Khalchi Wadi, Rajapur, Ratnagiri, Maharashtra Pin 416702 ({storeLat.toFixed(4)}° N, {storeLng.toFixed(4)}° E)</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5 text-[10px] bg-sky-50 text-sky-800 font-semibold p-2 rounded-lg border border-sky-100">
          <HelpCircle className="h-3.5 w-3.5 text-sky-600" />
          <span><b>Pro-Tip:</b> Drag the red pin inside the map or click directly to select your rooftop for accuracy!</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 💡 SIMULATED MULTI-INPUT DESIGN MAP
// ==========================================

function SimulatedDeliveryRouteMap({
  customerAddress,
  customerPincode,
  storeLat,
  storeLng,
  onDistanceCalculated,
}: {
  customerAddress: string;
  customerPincode: string;
  storeLat: number;
  storeLng: number;
  onDistanceCalculated?: (distance: number, info: any) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [calculatedDistance, setCalculatedDistance] = useState<number>(10);
  const [pinChecked, setPinChecked] = useState(customerPincode);
  const [customInputVal, setCustomInputVal] = useState('10.0');

  // Trigger the simulation mapping
  useEffect(() => {
    const code = customerPincode.trim().replace(/\D/g, '') || '416702';
    let dist = 8.4;
    
    const knownPincodes: Record<string, number> = {
      '416702': 0.8,   // Goval Rajapur Local Village (Image verified PIN code)
      '415612': 3.2,   // Sawarde Highs
      '415611': 4.5,   // Alore Outer Valley
      '415620': 8.9,   // Sawarde Town Square
      '415605': 12.0,  // Margtamhane Valley
      '415603': 18.5,  // Chiplun River Base
    };

    if (knownPincodes[code] !== undefined) {
      dist = knownPincodes[code];
    } else {
      // Stable hash calculations
      let hash = 0;
      for (let i = 0; i < code.length; i++) {
        hash = code.charCodeAt(i) + ((hash << 5) - hash);
      }
      dist = parseFloat((1.2 + (Math.abs(hash) % 233) / 10).toFixed(1));
    }

    setCalculatedDistance(dist);
    setCustomInputVal(dist.toString());
    setPinChecked(code);

    if (onDistanceCalculated) {
      onDistanceCalculated(dist, {
        avail: dist <= 20,
        formattedDistance: `${dist} km`,
        duration: 'Estimated by Interactive Local GeoGrid'
      });
    }
  }, [customerAddress, customerPincode]);

  // Handle slide/preset/field distance changes explicitly
  const handleDistanceChange = (newDist: number) => {
    const cleanDist = parseFloat(Math.min(50, Math.max(0.1, newDist)).toFixed(1));
    setCalculatedDistance(cleanDist);
    setCustomInputVal(cleanDist.toString());
    
    if (onDistanceCalculated) {
      onDistanceCalculated(cleanDist, {
        avail: cleanDist <= 20,
        formattedDistance: `${cleanDist} km`,
        duration: 'Manual coordinates overwrite'
      });
    }
  };

  const handleDistanceChangeAndKeepInput = (newDist: number, inputStr: string) => {
    const cleanDist = parseFloat(Math.min(50, Math.max(0.1, newDist)).toFixed(1));
    setCalculatedDistance(cleanDist);
    setCustomInputVal(inputStr);

    if (onDistanceCalculated) {
      onDistanceCalculated(cleanDist, {
        avail: cleanDist <= 20,
        formattedDistance: `${cleanDist} km`,
        duration: 'Manual coordinates overwrite'
      });
    }
  };

  return (
    <div className="flex flex-col">
      {/* Simulated Schematic Map Canvas */}
      <div className="relative h-[160px] bg-slate-950 text-white overflow-hidden flex flex-col justify-between p-4">
        {/* Background Visual Geogrid */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#15a34a_1.2px,transparent_1.2px)] [background-size:16px_16px]" />
        
        {/* Connection spline representation */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
            {/* Curved dotted line representing parcel path */}
            <path
              d="M 50,75 Q 200,15 350,75"
              fill="none"
              stroke="#059669"
              strokeWidth="2.5"
              strokeDasharray="6,4"
            />
            {/* Curving neon base light */}
            <path
              d="M 50,75 Q 200,15 350,75"
              fill="none"
              stroke="#10b981"
              strokeWidth="1"
              style={{ strokeOpacity: 0.3 }}
            />
          </svg>
        </div>

        {/* Origin Node Left */}
        <div className="absolute left-4 top-[40px] flex flex-col items-center">
          <div className="h-9 w-9 rounded-full bg-emerald-950 border-2 border-emerald-500 shadow-lg flex items-center justify-center relative z-2">
            <span className="text-sm">🏡</span>
            <div className="absolute -inset-1 rounded-full border border-emerald-400 animate-ping opacity-25 pointer-events-none" />
          </div>
          <span className="text-[8px] bg-emerald-800 text-white px-1.5 py-0.5 rounded font-black mt-1 uppercase whitespace-nowrap leading-none">
            Goval HQ
          </span>
          <span className="text-[6.5px] text-slate-400 font-mono mt-0.5">416702</span>
        </div>

        {/* Package truck floating in between */}
        <div className="absolute left-[47%] top-[15px] transform -translate-x-1/2 flex flex-col items-center animate-bounce">
          <div className="bg-emerald-900 border border-emerald-400 p-1.5 rounded-full shadow-lg">
            <Truck className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <span className="text-[8px] text-emerald-300 font-mono font-bold mt-1 bg-emerald-950/90 px-1 py-0.2 rounded border border-emerald-800/55">
            {calculatedDistance} km
          </span>
        </div>

        {/* Destination Node Right */}
        <div className="absolute right-4 top-[40px] flex flex-col items-center">
          <div className="h-9 w-9 rounded-full bg-slate-900 border-2 border-red-500 shadow-md flex items-center justify-center relative z-2">
            <span className="text-sm">📍</span>
          </div>
          <span className="text-[8px] bg-red-900 text-white px-1.5 py-0.5 rounded font-black mt-1 uppercase whitespace-nowrap leading-none">
            Customer address
          </span>
          <span className="text-[6.5px] text-slate-400 font-mono mt-0.5">PIN: {pinChecked || '...' }</span>
        </div>

        {/* Secret Key tip */}
        <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md border border-white/5 rounded-lg px-2.5 py-1 flex items-center justify-between text-[10px] z-5">
          <span className="text-slate-300 flex items-center gap-1 text-[8.5px]">
            <Key className="h-3 w-3 text-slate-400 shrink-0" />
            Add a Google Maps Key in Settings to compute actual driving routes!
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText('GOOGLE_MAPS_PLATFORM_KEY');
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="text-[9px] text-emerald-400 font-extrabold hover:underline cursor-pointer bg-transparent border-none p-0"
          >
            {copied ? 'Copied Key Name!' : 'How-To'}
          </button>
        </div>
      </div>

      {/* Interactive Delivery Control Panel */}
      <div className="p-4 bg-white border-t border-slate-100 flex flex-col gap-4 font-sans">
        
        {/* Area Presets Row */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Quick Area Preset Distance Toggles</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { label: '🏡 Goval Local', km: 0.8, color: 'hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300' },
              { label: '🛵 Sawarde', km: 5.2, color: 'hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300' },
              { label: '🌾 Alore Farm', km: 12.5, color: 'hover:bg-lime-50 hover:text-lime-700 hover:border-lime-200' },
              { label: '⛰️ Outer Valley', km: 18.6, color: 'hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200' },
              { label: '🛑 Out of Limit', km: 24.2, color: 'hover:bg-rose-50 hover:text-rose-700 hover:border-rose-250' },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleDistanceChange(preset.km)}
                className={`py-1.5 px-2 bg-white border border-slate-200 text-[10px] font-bold rounded-lg text-slate-600 shadow-sm transition-all text-center cursor-pointer ${preset.color} ${calculatedDistance === preset.km ? 'border-emerald-700 bg-emerald-50 text-emerald-800 font-extrabold ring-1 ring-emerald-600' : ''}`}
              >
                {preset.label}
                <div className="font-mono text-[9px] font-normal opacity-75 mt-0.5">{preset.km} km</div>
              </button>
            ))}
          </div>
        </div>

        {/* Exact Number Input field & Alert status box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Precise Numeric distance input (km)</span>
            <div className="relative flex items-center">
              <input
                type="number"
                min="0.1"
                max="50"
                step="0.1"
                placeholder="e.g. 8.3"
                value={customInputVal}
                onChange={(e) => {
                  setCustomInputVal(e.target.value);
                  const parsed = parseFloat(e.target.value);
                  if (!isNaN(parsed) && parsed > 0) {
                    handleDistanceChangeAndKeepInput(parsed, e.target.value);
                  }
                }}
                className="p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white text-xs font-bold font-mono pl-3.5 pr-10 w-full"
              />
              <span className="absolute right-4 text-[10px] text-slate-400 font-bold select-none cursor-default">km</span>
            </div>
          </div>
          
          <div className="flex flex-col justify-center text-[10.5px] leading-snug text-slate-600 bg-emerald-50/20 p-2.5 rounded-xl border border-emerald-100/50">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              {calculatedDistance <= 20 ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Free Delivery Active:
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0" /> Limit Exceeded:
                </>
              )}
            </span>
            <p className="mt-0.5 font-medium">
              {calculatedDistance <= 20 ? '🎉 Free delivery is applied to your order!' :
               '❌ Over 20 km is outside our rural kitchen service region.'}
            </p>
          </div>
        </div>

        {/* Village Kitchen Address description */}
        <div className="text-[10.5px] text-slate-500 leading-relaxed border-t border-slate-100 pt-2.5 mt-1 font-sans">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Admin Store Address info</div>
          <p>🏡 <b>Village Kitchen Address:</b> Goval, Khalchi Wadi, Rajapur, Ratnagiri, Maharashtra, 416702</p>
          <p className="mt-0.5 font-mono text-[9.5px]">Store Coordinates Latitude: {storeLat.toFixed(4)}° N, Longitude: {storeLng.toFixed(4)}° E</p>
        </div>
      </div>
    </div>
  );
}
