"use client";

interface WallpaperProps {
  wallpaper: string;
}

export default function Wallpaper({ wallpaper }: WallpaperProps) {
  const wallpapers = {
    monterey: "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900",
    bigsur: "bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600",
    catalina: "bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900",
    mojave: "bg-gradient-to-br from-orange-800 via-red-800 to-pink-800",
    ventura: "bg-gradient-to-br from-blue-500 via-teal-500 to-green-500",
    sonoma: "bg-gradient-to-br from-green-600 via-blue-600 to-purple-600",
    sequoia: "bg-gradient-to-br from-red-600 via-orange-600 to-yellow-600",
    dark: "bg-gradient-to-br from-gray-900 via-black to-gray-800"
  };

  const selectedWallpaper = wallpapers[wallpaper as keyof typeof wallpapers] || wallpapers.monterey;

  return (
    <div className={`absolute inset-0 ${selectedWallpaper}`}>
      {/* Overlay pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      {/* Subtle animation */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent animate-pulse opacity-20" />
    </div>
  );
}
