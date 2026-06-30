export interface MarketStat {
    title: string;
    value: string;
    description: string;
  }
  
  export interface TrendingLocation {
    name: string;
    growth: string;
    demand: string;
    investment: string;
  }
  
  export interface InsightArticle {
    title: string;
    category: string;
    description: string;
  }
  
  export const marketStats: MarketStat[] = [
    {
      title: "Average ROI",
      value: "18.6%",
      description: "Across premium GCC locations",
    },
    {
      title: "Rental Yield",
      value: "7.4%",
      description: "Average annual return",
    },
    {
      title: "Price Growth",
      value: "+12.8%",
      description: "Year-over-year increase",
    },
    {
      title: "Market Demand",
      value: "High",
      description: "Buyer activity signal",
    },
  ];
  
  export const trendingLocations: TrendingLocation[] = [
    {
      name: "Dubai Marina",
      growth: "+18.6%",
      demand: "92",
      investment: "95",
    },
    {
      name: "Palm Jumeirah",
      growth: "+21.4%",
      demand: "96",
      investment: "98",
    },
    {
      name: "Business Bay",
      growth: "+15.2%",
      demand: "88",
      investment: "91",
    },
    {
      name: "Doha West Bay",
      growth: "+11.7%",
      demand: "84",
      investment: "87",
    },
    {
      name: "Abu Dhabi Island",
      growth: "+13.4%",
      demand: "86",
      investment: "89",
    },
  ];
  
  export const insightArticles: InsightArticle[] = [
    {
      title: "Dubai Luxury Market Outlook 2026",
      category: "Luxury Market",
      description:
        "Premium villa and waterfront properties continue showing strong demand among international investors.",
    },
    {
      title: "Palm Jumeirah Investment Analysis",
      category: "Investment",
      description:
        "Long-term appreciation and rental demand remain among the strongest in the GCC region.",
    },
    {
      title: "Doha Rental Growth Report",
      category: "Rental Trends",
      description:
        "Rental demand continues to improve with increasing business and residential activity.",
    },
    {
      title: "Commercial Property Trends UAE",
      category: "Commercial",
      description:
        "Business districts show steady growth with increased demand for premium office spaces.",
    },
  ];