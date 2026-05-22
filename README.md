# Real-Time Tracker

A simple real-time location tracking app built with Node.js, Express, Socket.IO, and Leaflet.

## Features

- Real-time location updates using WebSockets
- Browser geolocation support
- Live map display with OpenStreetMap tiles
- Marker tracking for the current user and connected peers
- Responsive map layout with status information

## Prerequisites

- Node.js 18+ or newer
- npm (installed with Node.js)
- A modern browser with geolocation support

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sumit6511/live-location-tracker
   cd realtime-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Running the app

Start the server with:

```bash
npm start
```

Then open the app in your browser at:

```text
http://localhost:3000
```

## Usage

- Allow browser access to your location when prompted.
- The map will center on your current position and display a marker.
- When other clients connect and share their location, their markers are shown as well.
- The status box displays the current connection state and the last GPS update time.

## Project structure

- `app.js` - Main server application using Express and Socket.IO
- `views/index.ejs` - HTML template for the tracker page
- `public/css/style.css` - Styling for the map and status box
- `public/js/script.js` - Client-side map and socket logic
- `package.json` - Project metadata and dependencies

## Notes

- The app listens on port `3000` by default.
- If port `3000` is already in use, set a custom port before starting the server:

  ```bash
  PORT=4000 npm start
  ```

- Geolocation tracking requires HTTPS in most browsers when not running on `localhost`.

## License

This project is licensed under the ISC License.
