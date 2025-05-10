export interface CropCategory {
  id: string;
  name: string;
  crops: Crop[];
}

export interface Crop {
  id: string;
  name: string;
  varieties: string[];
}

export const CROP_CATEGORIES: CropCategory[] = [
  {
    id: "grains",
    name: "Grains & Cereals",
    crops: [
      {
        id: "rice",
        name: "Rice",
        varieties: [
          "Basmati", "Jasmine", "Brown Rice", "Sona Masuri", "Ponni", 
          "Red Rice", "Black Rice", "Arborio", "Sticky Rice", "Long Grain",
          "Medium Grain", "Short Grain", "Wild Rice", "Parboiled Rice"
        ]
      },
      {
        id: "wheat",
        name: "Wheat",
        varieties: [
          "Durum", "Common Wheat", "Emmer", "Einkorn", "Spelt",
          "Hard Red Winter", "Soft Red Winter", "Hard Red Spring",
          "Soft White", "Hard White", "Club Wheat", "Khorasan"
        ]
      },
      {
        id: "maize",
        name: "Maize/Corn",
        varieties: [
          "Sweet Corn", "Popcorn", "Dent Corn", "Flint Corn", "Baby Corn",
          "Field Corn", "Waxy Corn", "Pod Corn", "Indian Corn",
          "Blue Corn", "White Corn", "Yellow Corn"
        ]
      },
      {
        id: "millets",
        name: "Millets",
        varieties: [
          "Pearl Millet", "Finger Millet", "Foxtail Millet", "Barnyard Millet",
          "Kodo Millet", "Little Millet", "Proso Millet", "Sorghum Millet",
          "Japanese Barnyard Millet", "Brown Top Millet"
        ]
      },
      {
        id: "oats",
        name: "Oats",
        varieties: [
          "Common Oats", "Red Oats", "Hull-less Oats", "Winter Oats",
          "Spring Oats", "Black Oats", "Scottish Oats"
        ]
      }
    ]
  },
  {
    id: "pulses",
    name: "Pulses & Legumes",
    crops: [
      {
        id: "lentils",
        name: "Lentils",
        varieties: [
          "Red Lentils", "Green Lentils", "Brown Lentils", "Black Lentils",
          "Yellow Lentils", "French Green Lentils", "Beluga Lentils",
          "Pardina Lentils", "Masoor Dal", "Urad Dal"
        ]
      },
      {
        id: "chickpeas",
        name: "Chickpeas",
        varieties: [
          "Desi", "Kabuli", "Green Chickpeas", "Black Chickpeas",
          "Split Chickpeas", "Bengal Gram", "Chana Dal"
        ]
      },
      {
        id: "beans",
        name: "Beans",
        varieties: [
          "Kidney Beans", "Black Beans", "Navy Beans", "Pinto Beans",
          "Lima Beans", "Mung Beans", "Fava Beans", "Garbanzo Beans",
          "Great Northern Beans", "Cannellini Beans", "Adzuki Beans",
          "Black-eyed Peas", "Cowpeas"
        ]
      },
      {
        id: "pigeon_peas",
        name: "Pigeon Peas",
        varieties: [
          "Red Gram", "Toor Dal", "White Pigeon Peas",
          "Purple Pigeon Peas", "Early Maturing", "Medium Duration"
        ]
      }
    ]
  },
  {
    id: "vegetables",
    name: "Vegetables",
    crops: [
      {
        id: "tomatoes",
        name: "Tomatoes",
        varieties: [
          "Beefsteak", "Cherry", "Roma", "Plum", "Grape", "Heirloom",
          "San Marzano", "Better Boy", "Early Girl", "Brandywine",
          "Cherokee Purple", "Yellow Pear", "Sun Gold", "Big Boy"
        ]
      },
      {
        id: "potatoes",
        name: "Potatoes",
        varieties: ["Russet", "Red", "White", "Yellow", "Purple", "Fingerling"]
      },
      {
        id: "onions",
        name: "Onions",
        varieties: ["Red", "Yellow", "White", "Sweet", "Green"]
      },
      {
        id: "leafy_greens",
        name: "Leafy Greens",
        varieties: [
          "Spinach", "Lettuce", "Kale", "Swiss Chard", "Collard Greens",
          "Arugula", "Mustard Greens", "Watercress", "Bok Choy",
          "Romaine", "Iceberg", "Butterhead", "Frisée", "Endive"
        ]
      },
      {
        id: "gourds",
        name: "Gourds",
        varieties: [
          "Bottle Gourd", "Bitter Gourd", "Ridge Gourd", "Snake Gourd",
          "Ash Gourd", "Ivy Gourd", "Sponge Gourd", "Pointed Gourd",
          "Winter Melon", "Luffa"
        ]
      },
      {
        id: "root_vegetables",
        name: "Root Vegetables",
        varieties: [
          "Carrots", "Radishes", "Turnips", "Beets", "Sweet Potatoes",
          "Parsnips", "Rutabaga", "Celeriac", "Horseradish", "Daikon",
          "Yams", "Cassava", "Jerusalem Artichoke"
        ]
      },
      {
        id: "brassicas",
        name: "Brassicas",
        varieties: [
          "Cabbage", "Cauliflower", "Broccoli", "Brussels Sprouts",
          "Kohlrabi", "Romanesco", "Chinese Cabbage", "Gai Lan",
          "Choy Sum", "Rapini", "Kale", "Collards"
        ]
      }
    ]
  },
  {
    id: "fruits",
    name: "Fruits",
    crops: [
      {
        id: "mangoes",
        name: "Mangoes",
        varieties: ["Alphonso", "Dasheri", "Langra", "Chausa", "Kesar"]
      },
      {
        id: "citrus",
        name: "Citrus",
        varieties: ["Orange", "Lemon", "Lime", "Grapefruit", "Mandarin"]
      },
      {
        id: "berries",
        name: "Berries",
        varieties: ["Strawberry", "Blueberry", "Raspberry", "Blackberry"]
      },
      {
        id: "grapes",
        name: "Grapes",
        varieties: ["Thompson Seedless", "Flame Seedless", "Concord", "Black Grapes"]
      }
    ]
  },
  {
    id: "oilseeds",
    name: "Oilseeds",
    crops: [
      {
        id: "mustard",
        name: "Mustard",
        varieties: ["Yellow Mustard", "Brown Mustard", "Black Mustard"]
      },
      {
        id: "soybean",
        name: "Soybean",
        varieties: ["Yellow Soybean", "Black Soybean", "Green Soybean"]
      },
      {
        id: "groundnut",
        name: "Groundnut/Peanut",
        varieties: ["Virginia", "Spanish", "Valencia", "Runner"]
      },
      {
        id: "sunflower",
        name: "Sunflower",
        varieties: ["Oil Type", "Confectionery Type"]
      }
    ]
  },
  {
    id: "spices",
    name: "Spices & Condiments",
    crops: [
      {
        id: "chillies",
        name: "Chillies",
        varieties: ["Kashmiri", "Bird's Eye", "Ghost Pepper", "Cayenne", "Thai Chilli"]
      },
      {
        id: "turmeric",
        name: "Turmeric",
        varieties: ["Alleppey", "Salem", "Rajapuri", "Madras"]
      },
      {
        id: "ginger",
        name: "Ginger",
        varieties: ["Chinese", "Indian", "Japanese"]
      },
      {
        id: "cardamom",
        name: "Cardamom",
        varieties: ["Green Cardamom", "Black Cardamom"]
      }
    ]
  }
]; 