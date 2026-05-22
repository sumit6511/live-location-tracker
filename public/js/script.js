const socket = io();
const status = document.getElementById("status");
const statusMain = document.getElementById("status-main");
const statusSub = document.getElementById("status-sub");
let selfId = null;
let hasStartedTracking = false;
const markers = {};

function formatTime(date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function updateStatus(mainText, subText = "", isError = false) {
  if (!statusMain || !statusSub) return;
  statusMain.textContent = mainText;
  statusSub.textContent = subText;
  statusMain.style.color = isError ? "#a00" : "#111";
  statusSub.style.color = isError ? "#a00" : "#444";
}

socket.on("connect", () => {
  selfId = socket.id;
  updateStatus("Connected to Tracker", "Awaiting GPS Permission...");
});

socket.on("disconnect", () => {
  updateStatus("Disconnected from Tracker", "Reconnecting...", true);
});

socket.on("connect_error", (err) => {
  updateStatus("Connection Error", err.message, true);
});

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const time = formatTime(new Date());
      if (!hasStartedTracking) {
        hasStartedTracking = true;
      }
      updateStatus("Live Tracking Active", `Last Update: ${time}`);
      socket.emit("send-location", { latitude, longitude });
    },
    (err) => {
      updateStatus(`Geolocation Error: ${err.message}`, true);
      console.error(err);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    },
  );
} else {
  updateStatus("Geolocation NOT supported by your browser.", true);
}

const map = L.map("map").setView([0, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

socket.on("location-update", (data) => {
  if (
    !data ||
    typeof data.latitude !== "number" ||
    typeof data.longitude !== "number" ||
    !data.id
  ) {
    return;
  }

  const { id, latitude, longitude } = data;
  const label = id === selfId ? "You" : `User ${id.slice(0, 6)}`;

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]).setPopupContent(label);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map).bindPopup(label);
  }

  if (id === selfId) {
    map.setView([latitude, longitude], 16);
  }
});

socket.on("user-disconnect", ({ id }) => {
  if (!id || !markers[id]) return;
  map.removeLayer(markers[id]);
  delete markers[id];
});
