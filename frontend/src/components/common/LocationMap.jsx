import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { FaArrowRight } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import {
  contactInfo,
  officeCoordinates,
  OFFICE_MAP_ZOOM,
  buildDirectionsUrl,
} from '../../data/contactInfo';

/**
 * An interactive OpenStreetMap panel with a single marker.
 *
 * Free tiles, no API key and no account — Leaflet talks to OpenStreetMap
 * directly, and the only Google involvement is the plain "Get directions" URL
 * the popup links out to.
 *
 * Defaults come from contactInfo.js so the common case is just <LocationMap />,
 * but every value is a prop, so a second location can reuse this untouched.
 */

/**
 * The marker.
 *
 * Leaflet's stock pin is a PNG it resolves by a relative path that bundlers
 * rewrite, which is why so many Leaflet+Vite maps show a broken image icon.
 * Drawing the marker ourselves sidesteps that entirely — there is no image to
 * resolve — and lets it match the black circular pin the site already uses.
 *
 * Styles are inline because a divIcon takes an HTML string, not a class the
 * stylesheet knows about, and this keeps globals.css untouched.
 */
const MARKER_SIZE = 44;
const MARKER_TAIL = 9;

const markerHtml = `
  <span style="display:flex;flex-direction:column;align-items:center;">
    <span style="
      width:40px;height:40px;box-sizing:border-box;
      border-radius:9999px;background:#000;border:2px solid #fff;
      box-shadow:0 6px 16px rgba(0,0,0,0.35);
      display:flex;align-items:center;justify-content:center;
    ">
      <svg width="16" height="16" viewBox="0 0 384 512" fill="#fff" aria-hidden="true" focusable="false">
        <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
      </svg>
    </span>
    <span style="
      width:0;height:0;margin-top:-1px;
      border-left:6px solid transparent;border-right:6px solid transparent;
      border-top:${MARKER_TAIL}px solid #000;
    "></span>
  </span>
`;

// Passing our own className replaces Leaflet's default `leaflet-div-icon`,
// which would otherwise wrap the pin in a white box with a grey border.
const officeMarkerIcon = divIcon({
  html: markerHtml,
  className: 'bafana-office-marker',
  iconSize: [MARKER_SIZE, MARKER_SIZE + MARKER_TAIL],
  // Anchor on the tail's tip, so the point of the pin sits on the coordinate
  // rather than the badge's centre hovering above it.
  iconAnchor: [MARKER_SIZE / 2, MARKER_SIZE + MARKER_TAIL],
  popupAnchor: [0, -(MARKER_SIZE + MARKER_TAIL) + 6],
});

/**
 * Re-measures the map once it has been laid out.
 *
 * Leaflet caches its container size at construction. If the container is still
 * settling at that moment the map keeps the stale size and paints grey gaps
 * where tiles should be. One re-measure on the next frame is cheap insurance;
 * Leaflet's own `trackResize` handles every later window resize.
 */
const InvalidateSizeOnMount = () => {
  const map = useMap();

  useEffect(() => {
    const frame = requestAnimationFrame(() => map.invalidateSize());
    return () => cancelAnimationFrame(frame);
  }, [map]);

  return null;
};

export const LocationMap = ({
  latitude = officeCoordinates.lat,
  longitude = officeCoordinates.lng,
  zoom = OFFICE_MAP_ZOOM,
  name = 'Bafana@Law',
  address = contactInfo.address,
  className = '',
}) => {
  const position = useMemo(() => [latitude, longitude], [latitude, longitude]);
  const directionsUrl = buildDirectionsUrl({ lat: latitude, lng: longitude });

  return (
    // The label lives here rather than on MapContainer: react-leaflet forwards
    // only className, id and style to the DOM and folds everything else into
    // Leaflet's options, so an aria-label passed there would vanish silently.
    <div
      className={`w-full h-full ${className}`}
      role="region"
      aria-label={`Map showing the ${name} office at ${address}`}
    >
      <MapContainer
        center={position}
        zoom={zoom}
        // Without this, scrolling the page while the cursor is over the map
        // zooms the map instead of moving the page. Buttons, drag and pinch
        // all still zoom.
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />

        <Marker position={position} icon={officeMarkerIcon} title={`${name} — ${address}`}>
          <Popup>
            {/* `font-sans` is not redundant: leaflet.css sets Helvetica on
                .leaflet-container, which the popup inherits, so without this
                the card would drop out of the site's Inter. */}
            <div className="font-sans">
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-600 mb-1">
                {name}
              </span>
              <span className="block text-sm text-gray-700 leading-relaxed mb-3">
                {address}
              </span>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Get directions to ${name}, ${address} (opens Google Maps in a new tab)`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-black underline underline-offset-4 hover:text-gray-600 transition-colors"
              >
                Get directions
                <FaArrowRight aria-hidden="true" className="text-xs" />
              </a>
            </div>
          </Popup>
        </Marker>

        <InvalidateSizeOnMount />
      </MapContainer>
    </div>
  );
};

export default LocationMap;
