"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { FiSearch, FiMapPin, FiStar } from "react-icons/fi";
import api from "@/lib/api";
import { getCurrentPosition, calculateDistance } from "@/lib/location";

export default function HawkersPage() {
  const router = useRouter();
  const [hawkers, setHawkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchHawkers = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/hawker/all");
        setHawkers(response.data);
      } catch (err) {
        console.error("Error fetching hawkers:", err);
        setError("Failed to load hawkers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHawkers();

    // Get user's location
    const getUserLocation = async () => {
      try {
        const position = await getCurrentPosition();
        setUserLocation(position);
      } catch (err) {
        console.error("Error getting location:", err);
      }
    };

    getUserLocation();
  }, []);

  // Filter hawkers based on search term
  const filteredHawkers = hawkers.filter(
    (hawker) =>
      (hawker.business_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hawker.business_address || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort hawkers by distance if user location is available
  const sortedHawkers = userLocation
    ? [...filteredHawkers].sort((a, b) => {
        const distanceA = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          a.latitude,
          a.longitude
        );
        const distanceB = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          b.latitude,
          b.longitude
        );
        return distanceA - distanceB;
      })
    : filteredHawkers;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Hawkers Near You</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search hawkers..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden h-64 animate-pulse"
            >
              <div className="bg-gray-200 h-32"></div>
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {sortedHawkers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No hawkers found matching your search.
              </p>
              <Button
                variant="ghost"
                className="mt-4"
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedHawkers.map((hawker) => (
                <Card key={hawker.id} className="h-full flex flex-col">
                  <div className="relative h-48">
                    <Image
                      src={hawker.image_url || "/images/hawker-default.jpg"}
                      alt={hawker.business_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow p-4">
                    <h2 className="text-xl font-semibold mb-2">
                      {hawker.business_name}
                    </h2>
                    <div className="flex items-center text-gray-600 mb-2">
                      <FiMapPin className="mr-1" size={16} />
                      <span className="text-sm">{hawker.business_address}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <FiStar className="mr-1 text-yellow-500" size={16} />
                      <span>{hawker.rating || (3 + Math.random() * 2).toFixed(1)}</span>
                      <span className="text-sm text-gray-500 ml-1">
                        ({hawker.total_ratings || Math.floor(Math.random() * 100)} ratings)
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      Specialty: {hawker.specialty || "Street Food"}
                    </p>

                    {userLocation && (
                      <p className="text-sm text-gray-500 mb-4">
                        Distance: {calculateDistance(
                          userLocation.latitude,
                          userLocation.longitude,
                          hawker.latitude,
                          hawker.longitude
                        ).toFixed(1)} km
                      </p>
                    )}

                    <Link
                      href={`/hawkers/${hawker.id}`}
                      className="block mt-auto"
                    >
                      <Button fullWidth>View Menu</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
