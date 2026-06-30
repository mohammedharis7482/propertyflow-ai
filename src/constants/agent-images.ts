export const premiumAgentFallbackImages = [
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&crop=faces&w=1200&h=1500&q=90",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&crop=faces&w=1200&h=1500&q=90",
  "https://images.unsplash.com/photo-1619895862022-09114b41f16f?auto=format&fit=crop&crop=faces&w=1200&h=1500&q=90",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&w=1200&h=1500&q=90",
  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&crop=faces&w=1200&h=1500&q=90",
  "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&crop=faces&w=1200&h=1500&q=90",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&crop=faces&w=1200&h=1500&q=90",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&crop=faces&w=1200&h=1500&q=90",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&w=1200&h=1500&q=90",
];

export const premiumDefaultAgentImage = premiumAgentFallbackImages[0];

export function getPremiumAgentFallbackImage(seedValue?: string | number | null) {
  const seed = String(seedValue ?? "")
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return premiumAgentFallbackImages[seed % premiumAgentFallbackImages.length] ?? premiumDefaultAgentImage;
}
