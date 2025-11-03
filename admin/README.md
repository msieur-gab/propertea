
# Tea Details Recorder (Refactored)

A web-based application for recording, organizing, and exporting detailed tea information. This application allows tea enthusiasts to create comprehensive records of different teas, including their processing methods, flavor profiles, origin details, and geographic/climate data.

## Features

- Record detailed tea information including:
  - Tea name and optional original name
  - Tea type/family (White, Green, Yellow, Oolong, Black, Pu'er)
  - Processing methods (with suggestions and autocomplete)
  - Flavor profiles (with suggestions and autocomplete)
  - Caffeine and L-Theanine levels (0-10 scale)
  - Detailed origin information (Location search, auto-populating country/province/coordinates)
  - Optional: Auto-estimated altitude via API
  - Optional: Average climate data (Temperature, Humidity, Solar Radiation) via API
- Dynamic suggestions for processing methods and flavor profiles based on selected tea type.
- Add/remove processing methods and flavor profiles as dismissable chips.
- View, manage, and delete saved tea records locally.
- View detailed record information in a modal window.
- Copy individual record data as JSON from the modal.
- Data persists in browser's localStorage.

## Project Structure

```
/admin
├── index.html                 # Main HTML structure
├── css/
│   └── main.css               # Combined application styles
│
├── js/
│   ├── app.js                 # Main application entry point & orchestration
│   │
│   ├── services/              # Modules for external interactions
│   │   ├── storageService.js  # Handles localStorage CRUD operations
│   │   └── geoService.js      # Handles external Geo/Weather API calls
│   │
│   ├── modules/               # Core application logic modules
│   │   ├── teaData.js         # Static data definitions (types, methods, flavors, suggestions)
│   │   ├── recordHandler.js   # Creates, validates, formats tea record objects
│   │   ├── formUI.js          # Manages main form inputs, chips, suggestions
│   │   ├── recordListUI.js    # Manages the display and interaction of saved records list/modal
│   │   ├── geoUI.js           # Manages UI interactions for the geography section
│   │   └── autocomplete.js    # Reusable autocomplete component logic
│   │
│   └── utils/                   # Common utility functions
│       ├── formatters.js        # Text formatting helpers
│       └── clipboard.js         # Clipboard copy helper
│
└── README.md                  # This documentation file
```

## Usage

1.  Open `index.html` in a modern web browser (requires module support).
2.  Fill in the basic tea information (Name, Type).
3.  Select processing methods and flavor profiles using suggestions or the autocomplete input fields. Added items appear as chips.
4.  Optionally add Caffeine/L-Theanine levels.
5.  Use the Geography section to search for the origin location.
6.  Select a location from the search results to populate origin details.
7.  Optionally adjust altitude or keep auto-estimate checked.
8.  Click "Get Avg. Weather Data" to fetch climate information (optional).
9.  Click "Save Tea Record" to save the data locally.
10. View saved records below the form. Click "View" to see details in a modal or "Delete" to remove a record.
11. From the modal, click "Copy JSON" to copy the detailed record data.

## Data Storage

All tea records are stored in the browser's **localStorage**. Clearing browser data will remove saved records. No data is sent to an external server for storage (only for geo/weather API calls).

## Dependencies

- Relies on the [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) for location search.
- Relies on the [Open-Meteo Elevation API](https://open-meteo.com/en/docs/elevation-api) for altitude estimation.
- Relies on the [Open-Meteo Forecast/Historical API](https://open-meteo.com/en/docs) for weather data.

## API Integration

The admin panel sends analysis requests through `js/services/apiService.js`. The service automatically targets Netlify Functions when hosted on Netlify, but you can override the base URL for custom deployments:

- **Global override:** set `window.__PROPERTEA_API_BASE__ = '/api';` before loading `js/app.js`.
- **HTML data attribute:** add `data-api-base="/api"` on the `<html>` tag.
- **Manual instantiation:** create your own instance `new APIService('https://your-domain/api')`.

All options ensure that the POST request is sent to `{base}/analyze`, allowing seamless use with the new Express server or any reverse proxy.

For debugging the API you can append `?mode=explain` to the endpoint (or send `{ "options": { "explain": true } }` in the body) to receive extended reasoning traces. The UI continues to use the standard response mode by default.

## License

MIT License
