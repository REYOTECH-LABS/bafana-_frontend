export const contactInfo = {
  address: "Oxford House, 3rd Floor, SDA Junction, Adenta–Legon, Accra, Ghana",
  phone: ["+233 (0) 54 409 1118", "+233 (0) 20 000 0000"],
  email: "bafanalaw88@gmail.com",
  businessHours: {
    weekday: "8:30 AM – 5:00 PM",
    weekend: "9:00 AM – 1:00 PM (Sat), Closed (Sun)",
  },
  mapLocation: "Adenta–Legon, Accra, Ghana",
};

/**
 * Where the map centres and drops its marker.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │ THESE COORDINATES ARE APPROXIMATE — PLEASE REPLACE THEM.              │
 * │                                                                       │
 * │ OpenStreetMap has no record of "Oxford House, SDA Junction", so this  │
 * │ is the Adenta locality centre, not the building. The marker will      │
 * │ land in the right neighbourhood but not on the right doorstep.        │
 * │                                                                       │
 * │ To fix: open Google Maps, right-click the office, and click the       │
 * │ lat/lng pair at the top of the menu to copy it. Paste the two numbers │
 * │ below. Nothing else in the codebase needs to change — the map, the    │
 * │ marker and every "Get directions" link all read from here.            │
 * └───────────────────────────────────────────────────────────────────────┘
 */
export const officeCoordinates = {
  lat: 5.70424,
  lng: -0.1691,
};

/** Zoom level for the office map. 16 ≈ street level; higher zooms in closer. */
export const OFFICE_MAP_ZOOM = 16;

/**
 * Google Maps directions link for the office.
 *
 * Uses `dir/?api=1&destination=<lat>,<lng>` rather than a text search, so Maps
 * plots a route from wherever the visitor is instead of guessing at the
 * address. Coordinates are unambiguous; "SDA Junction" is not.
 *
 * No API key is involved — this is a plain URL anyone can open.
 */
export const buildDirectionsUrl = ({ lat, lng } = officeCoordinates) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
