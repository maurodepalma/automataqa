"use client";
import WorldMap from "@/components/ui/world-map";

export default function WorldMapDemo() {
  return (
    <div className="w-full">
      <p className="mb-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
        U.S. + LATAM Delivery Overlap
      </p>
      <WorldMap
        dots={[
          {
            start: {
              lat: -34.6037,
              lng: -58.3816,
            }, // Buenos Aires
            end: {
              lat: 40.7128,
              lng: -74.006,
            }, // New York
          },
          {
            start: { lat: 4.711, lng: -74.0721 }, // Bogota
            end: { lat: 37.7749, lng: -122.4194 }, // San Francisco
          },
          {
            start: { lat: -23.5505, lng: -46.6333 }, // Sao Paulo
            end: { lat: 30.2672, lng: -97.7431 }, // Austin
          },
          {
            start: { lat: 19.4326, lng: -99.1332 }, // Mexico City
            end: { lat: 41.8781, lng: -87.6298 }, // Chicago
          },
          {
            start: { lat: -12.0464, lng: -77.0428 }, // Lima
            end: { lat: 25.7617, lng: -80.1918 }, // Miami
          },
        ]}
        lineColor="#7A5CFF"
      />
    </div>
  );
}
